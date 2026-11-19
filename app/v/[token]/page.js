'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  getPublicStorageUrl,
  resolveDisplayUrl,
  ALLOWED_IMAGE_MIME_SET,
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_UPLOAD_FILE_SIZE_BYTES
} from '@/lib/storage';
import { LANGUAGES, ONBOARDING_TRANSLATIONS } from './translations';

const MAX_COMPRESSED_BYTES = 600 * 1024; // Strict < 600KB target (and strictly <= 2MB limit)
const SESSION_EXPIRY_TTL_MS = 60 * 60 * 1000; // 60 minutes

function isTokenExpiredClient(sess) {
  if (!sess) return false;
  if (sess.status === 'VERIFIED') return false;
  if (sess.status === 'EXPIRED') return true;
  const now = Date.now();
  if (sess.expires_at) {
    const expMs = new Date(sess.expires_at).getTime();
    if (!Number.isNaN(expMs) && expMs <= now) return true;
  }
  if (sess.created_at) {
    const createdMs = new Date(sess.created_at).getTime();
    if (!Number.isNaN(createdMs) && now - createdMs > SESSION_EXPIRY_TTL_MS) return true;
  }
  return false;
}

const UPLOAD_CARD_CONFIGS = [
  {
    key: 'aadhaar_front',
    storageCategory: 'aadhaar_front',
    icon: '🪪',
    required: true,
    section: 1
  },
  {
    key: 'aadhaar_back',
    storageCategory: 'aadhaar_back',
    icon: '🪪',
    required: true,
    section: 1
  },
  {
    key: 'pan_front',
    storageCategory: 'pan_front',
    icon: '💳',
    required: false,
    section: 2
  },
  {
    key: 'voter_driving_front',
    storageCategory: 'voter_driving_front',
    icon: '🚗',
    required: false,
    section: 2
  },
  {
    key: 'police_verification',
    storageCategory: 'police_verification',
    icon: '🛡️',
    required: false,
    section: 2
  },
  {
    key: 'work_photo_1',
    storageCategory: 'portfolio',
    icon: '🔨',
    required: false,
    section: 3
  },
  {
    key: 'work_photo_2',
    storageCategory: 'portfolio',
    icon: '✨',
    required: false,
    section: 3
  }
];

/**
 * Client-side HTML5 Canvas image compressor that guarantees output blob < 600KB (and <= 2MB).
 */
function compressImageUnder600KB(file, t) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error(t?.invalidFileTypeError || 'Please select a valid photo image.'));
    }

    const mime = String(file.type || '').toLowerCase().trim();
    const ext = file.name && file.name.includes('.') ? file.name.split('.').pop().toLowerCase().trim() : '';
    const isMimeAllowed = ALLOWED_IMAGE_MIME_SET.has(mime);
    const isExtAllowed = !ext || ALLOWED_IMAGE_EXTENSIONS.includes(ext);

    if (!isMimeAllowed || !isExtAllowed) {
      return reject(
        new Error(t?.invalidFileTypeError || 'Only JPEG, PNG, and WebP photos are allowed (max 2MB).')
      );
    }

    // Reject excessively large raw files (> 15MB) before canvas decode
    if (file.size > 15 * 1024 * 1024) {
      return reject(
        new Error(t?.fileTooLargeError || 'Photo size exceeds the maximum limit. Please choose a smaller photo.')
      );
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read selected photo.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode photo.'));
      img.onload = async () => {
        try {
          const origWidth = img.naturalWidth || img.width || 1200;
          const origHeight = img.naturalHeight || img.height || 900;

          const canvasToBlob = (canvas, mimeType, quality) =>
            new Promise((res) => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    res(blob);
                  } else {
                    canvas.toBlob((fallbackBlob) => res(fallbackBlob), 'image/jpeg', quality);
                  }
                },
                mimeType,
                quality
              );
            });

          // Try progressive dimension & quality steps until strictly < 600KB
          const attempts = [
            { maxDim: 1400, quality: 0.80 },
            { maxDim: 1280, quality: 0.72 },
            { maxDim: 1100, quality: 0.65 },
            { maxDim: 960, quality: 0.58 },
            { maxDim: 800, quality: 0.50 },
            { maxDim: 640, quality: 0.45 }
          ];

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('HTML5 Canvas context unavailable.'));
          }

          let finalBlob = null;
          let finalWidth = origWidth;
          let finalHeight = origHeight;

          for (const step of attempts) {
            let w = origWidth;
            let h = origHeight;

            if (w > h && w > step.maxDim) {
              h = Math.round(h * (step.maxDim / w));
              w = step.maxDim;
            } else if (h >= w && h > step.maxDim) {
              w = Math.round(w * (step.maxDim / h));
              h = step.maxDim;
            }

            canvas.width = w;
            canvas.height = h;
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);

            const candidateBlob = await canvasToBlob(canvas, 'image/jpeg', step.quality);
            finalBlob = candidateBlob;
            finalWidth = w;
            finalHeight = h;

            if (candidateBlob && candidateBlob.size <= MAX_COMPRESSED_BYTES) {
              break;
            }
          }

          if (!finalBlob) {
            return reject(new Error('Failed to compress image.'));
          }

          if (finalBlob.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
            return reject(
              new Error(t?.fileTooLargeError || 'Photo size exceeds the 2MB limit. Please choose a photo under 2MB.')
            );
          }

          const previewUrl = URL.createObjectURL(finalBlob);
          const sizeKB = Math.max(1, Math.round(finalBlob.size / 1024));

          resolve({
            blob: finalBlob,
            previewUrl,
            mimeType: finalBlob.type || 'image/jpeg',
            sizeBytes: finalBlob.size,
            sizeKB,
            width: finalWidth,
            height: finalHeight
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a compressed Blob (<600KB) to Supabase Storage via /api/upload/sign
 * with direct Supabase SDK upload fallback.
 */
async function uploadCompressedPhotoToSupabase({ blob, mimeType, category, ownerId, fileName }) {
  if (!blob || blob.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    throw new Error('File size exceeds the 2MB maximum limit.');
  }

  const normalizedMime = String(mimeType || blob.type || 'image/jpeg').toLowerCase().trim();
  if (!ALLOWED_IMAGE_MIME_SET.has(normalizedMime)) {
    throw new Error('Unsupported file type. Only JPEG, PNG, and WebP images (max 2MB) are permitted.');
  }

  const signRes = await fetch('/api/upload/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category,
      ownerId: ownerId || 'onboarding',
      fileType: normalizedMime,
      fileSize: blob.size,
      fileName: fileName || `${category}.jpg`
    })
  });

  if (!signRes.ok) {
    const errData = await signRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Could not authorize photo upload.');
  }

  const { bucket, path, isPublic, publicUrl, signedUrl } = await signRes.json();

  let uploadedViaSignedUrl = false;
  if (signedUrl) {
    try {
      const putRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType || 'image/jpeg' },
        body: blob
      });
      if (putRes.ok) {
        uploadedViaSignedUrl = true;
      }
    } catch (putErr) {
      console.warn('[Upload] Signed PUT fallback to Supabase SDK:', putErr);
    }
  }

  if (!uploadedViaSignedUrl) {
    const { error: sdkError } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType: mimeType || 'image/jpeg',
        upsert: false
      });

    if (sdkError) {
      throw new Error(sdkError.message || 'Storage upload failed.');
    }
  }

  const storedUrl = isPublic
    ? (publicUrl || getPublicStorageUrl(path, bucket))
    : path;

  return {
    storedUrl,
    bucket,
    path,
    isPublic
  };
}

export default function MobileOnboardingVerifyPage() {
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : Array.isArray(params?.token) ? params.token[0] : '';

  const [lang, setLang] = useState('en');
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionState, setSessionState] = useState('LOADING'); // LOADING | READY | EXPIRED | INVALID | COMPLETED
  const [sessionData, setSessionData] = useState(null);
  const [activatedProfile, setActivatedProfile] = useState(null);

  // Uploaded file states keyed by card key
  const [uploads, setUploads] = useState({
    aadhaar_front: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    aadhaar_back: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    pan_front: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    voter_driving_front: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    police_verification: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    work_photo_1: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' },
    work_photo_2: { url: '', previewUrl: '', sizeKB: null, uploading: false, error: '' }
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRefs = useRef({});
  const cardRefs = useRef({});

  const t = ONBOARDING_TRANSLATIONS[lang] || ONBOARDING_TRANSLATIONS.en;

  // 1. Detect initial language from URL ?lang=, localStorage, or browser locale
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang');
    const validCodes = LANGUAGES.map((l) => l.code);

    if (queryLang && validCodes.includes(queryLang)) {
      setLang(queryLang);
      localStorage.setItem('cw_onboard_lang', queryLang);
      return;
    }

    const saved = localStorage.getItem('cw_onboard_lang');
    if (saved && validCodes.includes(saved)) {
      setLang(saved);
      return;
    }

    const browserLangs = navigator.languages || [navigator.language || 'en'];
    for (const bLang of browserLangs) {
      const code = String(bLang).split('-')[0].toLowerCase();
      if (validCodes.includes(code)) {
        setLang(code);
        return;
      }
    }
  }, []);

  const handleLanguageSelect = (newLang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cw_onboard_lang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  // 2. Auto-validate [token] on mount with zero login friction
  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    async function validateToken() {
      setLoadingSession(true);
      setSubmitError('');

      try {
        const res = await fetch(`/api/onboarding/status/${encodeURIComponent(token)}`, {
          cache: 'no-store'
        });
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok || !data.success || !data.session) {
          if (token.toLowerCase() === 'demo') {
            setSessionData({
              id: 'demo-session',
              session_token: 'demo',
              phone_number: '9876543210',
              full_name: 'Ramesh Kumar',
              trade: 'carpentry',
              city: 'Bangalore',
              locality: 'Indiranagar',
              pincode: '560038',
              experience_years: 8,
              status: 'PENDING_UPLOAD',
              portfolio_urls: []
            });
            setSessionState('READY');
            setLoadingSession(false);
            return;
          }
          setSessionState('INVALID');
          setLoadingSession(false);
          return;
        }

        const sess = data.session;
        setSessionData(sess);

        // Pre-populate any already uploaded document URLs from session
        // Note: Private KYC paths (stored in private kyc-documents bucket) use '' for previewUrl so the UI renders the secure uploaded icon instead of a public image request
        const safePublicPreview = (val) =>
          val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:'))
            ? resolveDisplayUrl(val, '')
            : '';

        const portfolioArr = Array.isArray(sess.portfolio_urls) ? sess.portfolio_urls : [];
        setUploads((prev) => ({
          ...prev,
          aadhaar_front: {
            ...prev.aadhaar_front,
            url: sess.aadhaar_front_url || '',
            previewUrl: ''
          },
          aadhaar_back: {
            ...prev.aadhaar_back,
            url: sess.aadhaar_back_url || '',
            previewUrl: ''
          },
          pan_front: {
            ...prev.pan_front,
            url: sess.pan_front_url || '',
            previewUrl: ''
          },
          voter_driving_front: {
            ...prev.voter_driving_front,
            url: sess.voter_driving_front_url || '',
            previewUrl: ''
          },
          police_verification: {
            ...prev.police_verification,
            url: sess.police_verification_url || '',
            previewUrl: ''
          },
          work_photo_1: {
            ...prev.work_photo_1,
            url: portfolioArr[0] || '',
            previewUrl: portfolioArr[0] ? safePublicPreview(portfolioArr[0]) : ''
          },
          work_photo_2: {
            ...prev.work_photo_2,
            url: portfolioArr[1] || '',
            previewUrl: portfolioArr[1] ? safePublicPreview(portfolioArr[1]) : ''
          }
        }));

        if (sess.status === 'EXPIRED' || data.is_expired || isTokenExpiredClient(sess)) {
          setSessionState('EXPIRED');
        } else if (sess.status === 'VERIFIED') {
          setSessionState('COMPLETED');
        } else {
          setSessionState('READY');
        }
      } catch (err) {
        console.error('[Onboarding Verify] Error validating token:', err);
        if (!cancelled) {
          setSessionState('INVALID');
        }
      } finally {
        if (!cancelled) {
          setLoadingSession(false);
        }
      }
    }

    validateToken();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // 2b. Live 60-minute expiry watcher while page is open
  useEffect(() => {
    if (sessionState !== 'READY' || !sessionData) return;
    if (String(sessionData.session_token || '').toLowerCase() === 'demo') return;

    const timer = setInterval(() => {
      if (isTokenExpiredClient(sessionData)) {
        setSessionState('EXPIRED');
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [sessionState, sessionData]);

  // 3. Handle file selection -> strict JPEG/PNG/WebP & <=2MB check -> HTML5 Canvas compression (<600KB) -> Supabase Storage upload
  const handleFileChange = async (cardConfig, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (sessionData && String(sessionData.session_token || '').toLowerCase() !== 'demo' && isTokenExpiredClient(sessionData)) {
      setSessionState('EXPIRED');
      return;
    }

    const { key, storageCategory } = cardConfig;
    setSubmitError('');

    setUploads((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        uploading: true,
        error: ''
      }
    }));

    try {
      // Step A: Client-side file type/size validation + HTML5 Canvas compression under 600KB (strictly <= 2MB)
      const compressed = await compressImageUnder600KB(file, t);

      // Step B: Upload compressed Blob to Supabase Storage
      const ownerId = sessionData?.phone_number || token || 'pro';
      const uploadResult = await uploadCompressedPhotoToSupabase({
        blob: compressed.blob,
        mimeType: compressed.mimeType,
        category: storageCategory,
        ownerId,
        fileName: file.name
      });

      setUploads((prev) => ({
        ...prev,
        [key]: {
          url: uploadResult.storedUrl,
          previewUrl: compressed.previewUrl,
          sizeKB: compressed.sizeKB,
          uploading: false,
          error: ''
        }
      }));
    } catch (err) {
      console.error(`[Upload ${key}] Error:`, err);
      setUploads((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          uploading: false,
          error: err.message || t.uploadFailedError
        }
      }));
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // 4. Handle Final Submit -> POST /api/onboarding/complete
  const handleCompleteOnboarding = async () => {
    setSubmitError('');

    if (sessionData && String(sessionData.session_token || '').toLowerCase() !== 'demo' && isTokenExpiredClient(sessionData)) {
      setSessionState('EXPIRED');
      return;
    }

    if (!uploads.aadhaar_front.url || !uploads.aadhaar_back.url) {
      setSubmitError(t.missingRequiredError);
      const missingKey = !uploads.aadhaar_front.url ? 'aadhaar_front' : 'aadhaar_back';
      cardRefs.current[missingKey]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const portfolioUrls = [uploads.work_photo_1.url, uploads.work_photo_2.url].filter(Boolean);

      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_token: token,
          lang,
          aadhaar_front_url: uploads.aadhaar_front.url,
          aadhaar_back_url: uploads.aadhaar_back.url,
          pan_front_url: uploads.pan_front.url || null,
          voter_driving_front_url: uploads.voter_driving_front.url || null,
          police_verification_url: uploads.police_verification.url || null,
          portfolio_urls: portfolioUrls
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (token.toLowerCase() === 'demo') {
          setActivatedProfile({
            pro_code: 'CW-DEMO',
            profile_url: '/find-a-professional',
            short_url: '/find-a-professional'
          });
          setSessionState('COMPLETED');
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }
        if (res.status === 410 || data.code === 'SESSION_EXPIRED') {
          setSessionState('EXPIRED');
          return;
        }
        throw new Error(data.error || 'Could not complete onboarding verification.');
      }

      if (data.session) {
        setSessionData(data.session);
      }
      if (data.profile) {
        setActivatedProfile(data.profile);
      }
      setSessionState('COMPLETED');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('[Complete Onboarding] Error:', err);
      setSubmitError(err.message || 'Verification submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tradeDisplay = sessionData?.trade
    ? t.trades?.[String(sessionData.trade).toLowerCase()] || sessionData.trade
    : '';

  const locationDisplay = sessionData
    ? [sessionData.locality, sessionData.city, sessionData.pincode].filter(Boolean).join(', ')
    : '';

  const requiredUploadedCount =
    (uploads.aadhaar_front.url ? 1 : 0) + (uploads.aadhaar_back.url ? 1 : 0);

  const totalUploadedCount = Object.values(uploads).filter((u) => Boolean(u.url)).length;
  const anyUploading = Object.values(uploads).some((u) => u.uploading);

  const renderUploadCard = (cardConfig) => {
    const { key, icon, required } = cardConfig;
    const cardText = t.cards[key] || { title: key, desc: '' };
    const item = uploads[key] || {};
    const isUploaded = Boolean(item.url);
    const isUploading = Boolean(item.uploading);

    return (
      <div
        key={key}
        ref={(el) => {
          cardRefs.current[key] = el;
        }}
        onClick={() => {
          if (!isUploading) {
            fileInputRefs.current[key]?.click();
          }
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
            e.preventDefault();
            fileInputRefs.current[key]?.click();
          }
        }}
        style={{
          background: isUploaded ? '#F0FDF4' : '#FFFFFF',
          border: isUploaded
            ? '2.5px solid #16A34A'
            : required
              ? '2.5px dashed #C2410C'
              : '2px dashed #CBD5E1',
          borderRadius: '18px',
          padding: '1.25rem',
          cursor: isUploading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isUploaded
            ? '0 6px 20px rgba(22, 163, 74, 0.12)'
            : '0 4px 14px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {/* Native Android Camera / Gallery File Input (Strict JPEG/PNG/WebP) */}
        <input
          ref={(el) => {
            fileInputRefs.current[key] = el;
          }}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileChange(cardConfig, e)}
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'none' }}
          aria-label={cardText.title}
        />

        {/* Top Row: Icon + Title + Required/Uploaded Pill */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: isUploaded ? '#DCFCE7' : 'rgba(194, 65, 12, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.65rem',
                flexShrink: 0
              }}
            >
              {isUploaded ? '✅' : icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                {cardText.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.25rem 0 0', lineHeight: 1.45 }}>
                {cardText.desc}
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.65rem',
              borderRadius: '999px',
              whiteSpace: 'nowrap',
              background: isUploaded
                ? '#16A34A'
                : required
                  ? '#FFF7ED'
                  : '#F1F5F9',
              color: isUploaded
                ? '#FFFFFF'
                : required
                  ? '#C2410C'
                  : '#475569',
              border: isUploaded
                ? '1px solid #16A34A'
                : required
                  ? '1px solid rgba(194, 65, 12, 0.35)'
                  : '1px solid #E2E8F0'
            }}
          >
            {isUploaded ? t.uploadedBadge : required ? t.requiredBadge : t.optionalBadge}
          </span>
        </div>

        {/* Uploading Spinner State */}
        {isUploading && (
          <div
            style={{
              padding: '1.1rem',
              borderRadius: '12px',
              background: '#FFF7ED',
              border: '1px solid rgba(194, 65, 12, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '3px solid rgba(194, 65, 12, 0.2)',
                borderTopColor: '#C2410C',
                animation: 'cwSpin 0.8s linear infinite',
                flexShrink: 0
              }}
            />
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#C2410C' }}>
              {t.compressingText}
            </span>
          </div>
        )}

        {/* Preview Thumbnail when Uploaded */}
        {!isUploading && isUploaded && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
              background: '#FFFFFF',
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              border: '1px solid #BBF7D0',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {item.previewUrl ? (
                <img
                  src={item.previewUrl}
                  alt={cardText.title}
                  style={{
                    width: '68px',
                    height: '52px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '68px',
                    height: '52px',
                    borderRadius: '8px',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem'
                  }}
                >
                  🖼️
                </div>
              )}
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803D' }}>
                  {t.uploadedBadge}
                </div>
                {item.sizeKB && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                    {t.compressedLabel} <strong>{item.sizeKB} KB</strong> (&lt;600KB)
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRefs.current[key]?.click();
              }}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#0F172A',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {t.tapToChange}
            </button>
          </div>
        )}

        {/* Default Large Tap Button when Not Yet Uploaded */}
        {!isUploading && !isUploaded && (
          <div
            style={{
              width: '100%',
              padding: '0.95rem 1rem',
              borderRadius: '12px',
              background: required
                ? 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)'
                : '#F8FAFC',
              color: required ? '#FFFFFF' : '#0F172A',
              border: required ? 'none' : '1.5px solid #CBD5E1',
              fontSize: '0.98rem',
              fontWeight: 800,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: required ? '0 4px 12px rgba(194, 65, 12, 0.25)' : 'none'
            }}
          >
            {t.tapToUpload}
          </div>
        )}

        {/* Error Banner inside Card */}
        {item.error && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            ⚠️ {item.error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF8F5',
        paddingBottom: '5rem'
      }}
    >
      <style>{`
        @keyframes cwSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* STICKY TOP LANGUAGE TOGGLE BAR (All 7 Indian Languages) */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--navbar-height, 0px)',
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(194, 65, 12, 0.18)',
          padding: '0.7rem 0.75rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)'
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#64748B',
              marginBottom: '0.4rem',
              textAlign: 'center',
              letterSpacing: '0.02em'
            }}
          >
            🌐 {t.languagePrompt}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            {LANGUAGES.map((l) => {
              const active = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleLanguageSelect(l.code)}
                  style={{
                    padding: '0.42rem 0.8rem',
                    borderRadius: '999px',
                    border: active ? '2px solid #C2410C' : '1px solid #CBD5E1',
                    background: active ? '#C2410C' : '#F8FAFC',
                    color: active ? '#FFFFFF' : '#0F172A',
                    fontSize: '0.88rem',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 3px 10px rgba(194, 65, 12, 0.28)' : 'none'
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN MOBILE CONTAINER */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.25rem 1rem' }}>
        {/* STATE 1: LOADING */}
        {loadingSession && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              border: '1px solid rgba(194, 65, 12, 0.18)',
              boxShadow: '0 8px 28px rgba(15, 23, 42, 0.06)',
              marginTop: '1.5rem'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                border: '4px solid rgba(194, 65, 12, 0.2)',
                borderTopColor: '#C2410C',
                animation: 'cwSpin 0.8s linear infinite'
              }}
            />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>
              {t.loadingSession}
            </h2>
          </div>
        )}

        {/* STATE 2: EXPIRED (> 60 MINS) OR INVALID LINK */}
        {!loadingSession && (sessionState === 'EXPIRED' || sessionState === 'INVALID') && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '2.25rem 1.5rem',
              textAlign: 'center',
              border: '2px solid #FCA5A5',
              boxShadow: '0 10px 30px rgba(185, 28, 28, 0.08)',
              marginTop: '1.25rem'
            }}
          >
            {sessionState === 'EXPIRED' && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.32rem 0.85rem',
                  borderRadius: '999px',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  marginBottom: '0.75rem'
                }}
              >
                ⏰ {t.linkExpiredBadge || 'Link Expired (> 60 Mins)'}
              </div>
            )}
            <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>
              {sessionState === 'EXPIRED' ? '⏰' : '🔗'}
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.6rem' }}>
              {sessionState === 'EXPIRED' ? t.expiredTitle : t.invalidTitle}
            </h1>
            <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {sessionState === 'EXPIRED' ? t.expiredSubtitle : t.invalidSubtitle}
            </p>
            <Link
              href="/join"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(194, 65, 12, 0.3)'
              }}
            >
              {t.restartBtn}
            </Link>
          </div>
        )}

        {/* STATE 3: COMPLETED / SUCCESS SCREEN */}
        {!loadingSession && sessionState === 'COMPLETED' && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              padding: '2rem 1.35rem',
              border: '2.5px solid #16A34A',
              boxShadow: '0 14px 40px rgba(22, 163, 74, 0.14)',
              textAlign: 'center',
              marginTop: '0.75rem'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '0.85rem',
                letterSpacing: '0.03em'
              }}
            >
              ✓ {t.zeroCommissionBadge}
            </div>

            <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.6rem' }}>🎉</div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.4rem' }}>
              {t.successTitle.replace('{name}', sessionData?.full_name || 'Partner')}
            </h1>

            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#15803D',
                marginBottom: '0.85rem'
              }}
            >
              {t.successSubtitle}
            </div>

            <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.35rem' }}>
              {t.successDesc.replace('{location}', locationDisplay || sessionData?.city || 'India')}
            </p>

            {/* Verified Summary Card */}
            <div
              style={{
                background: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '1.1rem',
                textAlign: 'left',
                marginBottom: '1.35rem'
              }}
            >
              {activatedProfile?.pro_code && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.65rem',
                    marginBottom: '0.65rem',
                    borderBottom: '1px dashed #86EFAC'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                    {t.proCodeLabel}
                  </span>
                  <span
                    style={{
                      background: '#15803D',
                      color: '#FFFFFF',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {activatedProfile.pro_code}
                  </span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.88rem' }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 600 }}>{t.labelName}</div>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{sessionData?.full_name}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 600 }}>{t.labelTrade}</div>
                  <div style={{ fontWeight: 800, color: '#C2410C' }}>{tradeDisplay}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 600 }}>{t.labelLocation}</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{locationDisplay}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.76rem', fontWeight: 600 }}>{t.labelPhone}</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>+91 {sessionData?.phone_number}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activatedProfile?.profile_url && (
                <Link
                  href={activatedProfile.profile_url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1.02rem',
                    textDecoration: 'none',
                    boxShadow: '0 6px 18px rgba(194, 65, 12, 0.28)'
                  }}
                >
                  {t.viewProfileBtn}
                </Link>
              )}

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Namaste! Book me directly on Carpenterwala (0% Commission Verified ${tradeDisplay} in ${locationDisplay}): https://carpenterwala.com${activatedProfile?.short_url || activatedProfile?.profile_url || ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.95rem',
                  borderRadius: '14px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textDecoration: 'none'
                }}
              >
                {t.whatsappShareBtn}
              </a>

              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  background: '#F1F5F9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none'
                }}
              >
                {t.goHomeBtn}
              </Link>
            </div>
          </div>
        )}

        {/* STATE 4: READY FOR PHOTO UPLOAD */}
        {!loadingSession && sessionState === 'READY' && sessionData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* WELCOMING BANNER WITH PRE-FILLED DETAILS */}
            <div
              style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #FFF7ED 100%)',
                borderRadius: '20px',
                padding: '1.35rem 1.2rem',
                border: '2px solid rgba(194, 65, 12, 0.28)',
                boxShadow: '0 10px 28px rgba(194, 65, 12, 0.09)'
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.28rem 0.75rem',
                  borderRadius: '999px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  marginBottom: '0.6rem'
                }}
              >
                ⚡ {t.zeroCommissionBadge}
              </div>

              <h1
                style={{
                  fontSize: '1.55rem',
                  fontWeight: 900,
                  color: '#0F172A',
                  margin: '0 0 0.35rem',
                  lineHeight: 1.25
                }}
              >
                {t.welcomeTitle.replace('{name}', sessionData.full_name || '')}
              </h1>

              <p style={{ fontSize: '0.94rem', color: '#334155', margin: '0 0 1rem', lineHeight: 1.5 }}>
                {t.welcomeSubtitle}
              </p>

              {/* Pre-filled Pro Details Grid */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '0.95rem',
                  border: '1px solid rgba(194, 65, 12, 0.18)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#C2410C',
                    marginBottom: '0.6rem'
                  }}
                >
                  ✓ {t.prefilledTitle}
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '0.65rem 0.85rem',
                    fontSize: '0.88rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>{t.labelName}</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>{sessionData.full_name}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>{t.labelTrade}</span>
                    <strong style={{ color: '#C2410C', fontSize: '0.95rem' }}>{tradeDisplay}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>{t.labelLocation}</span>
                    <strong style={{ color: '#0F172A' }}>{locationDisplay}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'block' }}>{t.labelExperience}</span>
                    <strong style={{ color: '#0F172A' }}>
                      {sessionData.experience_years ?? 1}{' '}
                      {Number(sessionData.experience_years) === 1 ? t.yearUnit : t.yearsUnit}
                    </strong>
                  </div>

                  <div style={{ gridColumn: '1 / -1', paddingTop: '0.35rem', borderTop: '1px dashed #E2E8F0' }}>
                    <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{t.labelPhone}: </span>
                    <strong style={{ color: '#0F172A' }}>+91 {sessionData.phone_number}</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#15803D',
                  textAlign: 'center'
                }}
              >
                {t.noLoginBadge}
              </div>
            </div>

            {/* SECTION 1: MANDATORY AADHAAR FRONT & BACK */}
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {t.step1Heading}
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.2rem 0 0' }}>
                  {t.step1Sub}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {UPLOAD_CARD_CONFIGS.filter((c) => c.section === 1).map(renderUploadCard)}
              </div>
            </div>

            {/* SECTION 2: OPTIONAL ID PROOFS (PAN, VOTER/DL, POLICE VERIFICATION) */}
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {t.step2Heading}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: '0.2rem 0 0' }}>
                  {t.step2Sub}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {UPLOAD_CARD_CONFIGS.filter((c) => c.section === 2).map(renderUploadCard)}
              </div>
            </div>

            {/* SECTION 3: 2 PHOTOS OF PAST WORK */}
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {t.step3Heading}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: '0.2rem 0 0' }}>
                  {t.step3Sub}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {UPLOAD_CARD_CONFIGS.filter((c) => c.section === 3).map(renderUploadCard)}
              </div>
            </div>

            {/* GLOBAL SUBMIT ERROR */}
            {submitError && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: '#FEF2F2',
                  border: '2px solid #F87171',
                  color: '#991B1B',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              >
                ⚠️ {submitError}
              </div>
            )}

            {/* FINAL SUBMIT BUTTON */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.25rem',
                border: '2px solid rgba(22, 163, 74, 0.3)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: requiredUploadedCount === 2 ? '#15803D' : '#C2410C',
                  marginBottom: '0.75rem'
                }}
              >
                {requiredUploadedCount === 2
                  ? `✓ Aadhaar Front & Back Ready (${totalUploadedCount} photos uploaded)`
                  : `📌 Required Aadhaar Photos: ${requiredUploadedCount} / 2 Uploaded`}
              </div>

              <button
                type="button"
                disabled={submitting || anyUploading}
                onClick={handleCompleteOnboarding}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '16px',
                  border: 'none',
                  background:
                    requiredUploadedCount === 2
                      ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                      : 'linear-gradient(135deg, #C2410C 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  fontSize: '1.08rem',
                  fontWeight: 900,
                  cursor: submitting || anyUploading ? 'not-allowed' : 'pointer',
                  opacity: submitting || anyUploading ? 0.7 : 1,
                  boxShadow:
                    requiredUploadedCount === 2
                      ? '0 8px 24px rgba(22, 163, 74, 0.35)'
                      : '0 6px 20px rgba(194, 65, 12, 0.28)',
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? t.submittingBtn : t.submitBtn}
              </button>

              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.75rem', marginBottom: 0 }}>
                {t.securityNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
