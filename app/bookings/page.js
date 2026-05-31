'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.35rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0',
            fontSize: '2rem', color: star <= (hovered || value) ? '#f59e0b' : 'rgba(255,255,255,0.2)',
            transition: 'color 0.15s', lineHeight: 1
          }}>★</button>
      ))}
    </div>
  );
}

function ReviewModal({ booking, customerName, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pro_id: booking.profiles?.id,
          author: customerName || 'Anonymous',
          rating,
          text,
        }),
      });
      if (res.ok) {
        onSubmitted(booking.id);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit. Try again.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '480px', padding: '2rem',
        borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Rate Your Experience</h2>
            <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              with <strong>{booking.profiles?.name || 'this professional'}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.5rem',
            cursor: 'pointer', opacity: 0.6, lineHeight: 1
          }}>×</button>
        </div>

        {/* Pro info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1.5rem'
        }}>
          <img src={booking.profiles?.avatar || `https://i.pravatar.cc/80?u=${booking.profiles?.name}`}
            alt={booking.profiles?.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{booking.profiles?.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{booking.profiles?.trade} · {booking.profiles?.location}</div>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171', padding: '0.6rem 1rem', borderRadius: '8px',
            fontSize: '0.88rem', marginBottom: '1rem'
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Your Rating <span style={{ color: '#f59e0b' }}>*</span>
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <span style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.3rem', display: 'block' }}>
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
              </span>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
              Your Review <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <textarea rows={3} placeholder="Tell others about your experience..."
              value={text} onChange={e => setText(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px',
                border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                color: 'white', fontSize: '0.9rem', resize: 'vertical'
              }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RebookModal({ booking, customerName, customerPhone, onClose, onSubmitted }) {
  const [task, setTask] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) { setError('Please describe the task you need help with.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId: booking.profiles?.id,
          name: customerName,
          phone: customerPhone,
          task,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSubmitted();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit booking request. Try again.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(4px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '480px', padding: '2rem',
        borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Re-book Professional</h2>
            <p style={{ opacity: 0.65, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Book the same service and professional
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.5rem',
            cursor: 'pointer', opacity: 0.6, lineHeight: 1
          }}>×</button>
        </div>

        {/* Pro info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '1.5rem'
        }}>
          <img src={booking.profiles?.avatar || `https://i.pravatar.cc/80?u=${booking.profiles?.name}`}
            alt={booking.profiles?.name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{booking.profiles?.name}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{booking.profiles?.trade} · {booking.profiles?.location}</div>
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#34d399" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✓</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Booking Request Sent!</h3>
            <p style={{ opacity: 0.8, marginTop: "0.5rem", fontSize: '0.9rem' }}>
              We have dispatched your request to {booking.profiles?.name || 'the professional'}.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', padding: '0.6rem 1rem', borderRadius: '8px',
                fontSize: '0.88rem', marginBottom: '1rem'
              }}>⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                  What do you need help with? <span style={{ color: '#3b82f6' }}>*</span>
                </label>
                <textarea rows={3} required
                  placeholder="Describe your new task or project in detail..."
                  value={task} onChange={e => setTask(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                    border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: '0.9rem', resize: 'vertical'
                  }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Sending Request...' : 'Confirm Re-book'}
                </button>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Custom categories and visual configuration
const CATEGORIES = [
  { id: 'Television', label: 'Television', emoji: '📺', color: '#3b82f6' },
  { id: 'Washing Machine', label: 'Washing Machine', emoji: '🧺', color: '#10b981' },
  { id: 'Iron Box', label: 'Iron Box', emoji: '🔌', color: '#f59e0b' },
  { id: 'Phone', label: 'Smartphone / Tablet', emoji: '📱', color: '#8b5cf6' },
  { id: 'Other', label: 'Other Appliance', emoji: '⚙️', color: '#6b7280' }
];

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1.25rem',
  borderRadius: '10px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s',
};

// Wizard Modal component to add customer warranties
function AddWarrantyModal({ customerPhone, onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('12'); // default 12 months
  const [notes, setNotes] = useState('');
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);

  // Storing Base64 document formats
  const [receiptBase64, setReceiptBase64] = useState(null);
  const [receiptMeta, setReceiptMeta] = useState(null); // size, name
  
  const [invoiceBase64, setInvoiceBase64] = useState(null);
  const [invoiceMeta, setInvoiceMeta] = useState(null);

  const [warrantyCardBase64, setWarrantyCardBase64] = useState(null);
  const [warrantyCardMeta, setWarrantyCardMeta] = useState(null);

  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle local files compressor
  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressing(true);
    try {
      const result = await compressFile(file);
      if (type === 'receipt') {
        setReceiptBase64(result.base64);
        setReceiptMeta({ name: file.name, sizeKb: result.sizeKb });
      } else if (type === 'invoice') {
        setInvoiceBase64(result.base64);
        setInvoiceMeta({ name: file.name, sizeKb: result.sizeKb });
      } else if (type === 'card') {
        setWarrantyCardBase64(result.base64);
        setWarrantyCardMeta({ name: file.name, sizeKb: result.sizeKb });
      }
    } catch (err) {
      console.error(err);
      setError('Could not process this file format. Please try standard image files (PNG/JPEG/WebP).');
    } finally {
      setCompressing(false);
    }
  };

  const compressFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Optimal for invoices/receipt text readability
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to lightweight JPEG
          const base64 = canvas.toDataURL('image/jpeg', 0.65);
          const sizeKb = Math.round((base64.length * 3) / 4 / 1024);
          resolve({ base64, sizeKb });
        };
        img.onerror = () => reject('Image load failed');
      };
      reader.onerror = () => reject('File read error');
    });
  };

  const handleNext = () => {
    if (step === 1 && !category) { setError('Please select a category to continue.'); return; }
    if (step === 2 && (!name.trim() || !purchaseDate || !startDate || !duration)) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disclaimerAgreed) {
      setError('You must read and agree to the disclaimer to save your warranty.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/customer/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_phone: customerPhone,
          category,
          appliance_name: name,
          purchase_date: purchaseDate,
          warranty_start_date: startDate,
          warranty_duration_months: parseInt(duration, 10),
          receipt_copy: receiptBase64,
          invoice_copy: invoiceBase64,
          warranty_card_copy: warrantyCardBase64,
          notes: notes
        })
      });

      if (res.ok) {
        onSaved();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save warranty record.');
        setSubmitting(false);
      }
    } catch {
      setError('Network error occurred. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', backdropFilter: 'blur(5px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '560px', borderRadius: '20px',
        boxShadow: '0 25px 65px rgba(0,0,0,0.6)', overflow: 'hidden'
      }}>
        {/* Header banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
          padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🛡️</span> Add Appliance Warranty
            </h2>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{
                  height: '4px', width: '32px', borderRadius: '4px',
                  background: s <= step ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.3s'
                }} />
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white', fontSize: '1.6rem',
            cursor: 'pointer', opacity: 0.6, lineHeight: 1
          }}>×</button>
        </div>

        <div style={{ padding: '2rem', maxHeight: '72vh', overflowY: 'auto' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px',
              fontSize: '0.88rem', marginBottom: '1.5rem'
            }}>⚠️ {error}</div>
          )}

          {/* STEP 1: Select Category */}
          {step === 1 && (
            <div className="animate-fade-in">
              <label style={{ fontSize: '1rem', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
                Select Appliance Category:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {CATEGORIES.map(cat => {
                  const selected = category === cat.id;
                  return (
                    <button key={cat.id} type="button"
                      onClick={() => { setCategory(cat.id); setError(''); }}
                      style={{
                        padding: '1.5rem 1rem', borderRadius: '12px',
                        border: selected ? `2px solid var(--primary)` : '1px solid var(--glass-border)',
                        background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                        color: 'white', cursor: 'pointer', textAlign: 'center',
                        transition: 'transform 0.15s, border-color 0.15s',
                        transform: selected ? 'scale(1.02)' : 'none',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                      }}>
                      <span style={{ fontSize: '2.5rem' }}>{cat.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Appliance Name / Model <span style={{ color: 'var(--primary)' }}>*</span></label>
                <input type="text" placeholder="e.g. LG 8Kg Front Load, Apple iPhone 15 Pro"
                  value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Purchase Date <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input type="date" value={purchaseDate}
                    onChange={e => {
                      setPurchaseDate(e.target.value);
                      if (!startDate) setStartDate(e.target.value); // Sync start date automatically
                    }}
                    style={inputStyle} required />
                </div>
                <div className="flex flex-col gap-1" style={{ flex: 1, minWidth: '180px' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>
                    Warranty Start Date <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    style={inputStyle} required />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Warranty Duration (Months) <span style={{ color: 'var(--primary)' }}>*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {['6', '12', '24', '36'].map(m => (
                    <button key={m} type="button"
                      onClick={() => setDuration(m)}
                      style={{
                        padding: '0.4rem 1rem', borderRadius: '20px',
                        border: duration === m ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                        background: duration === m ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                        color: duration === m ? 'var(--primary)' : 'white',
                        cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500
                      }}>
                      {m === '12' ? '1 Year' : m === '24' ? '2 Years' : m === '36' ? '3 Years' : `${m} Months`}
                    </button>
                  ))}
                  <button type="button" onClick={() => setDuration('')}
                    style={{
                      padding: '0.4rem 1rem', borderRadius: '20px',
                      border: !['6', '12', '24', '36'].includes(duration) ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                      background: !['6', '12', '24', '36'].includes(duration) ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      color: !['6', '12', '24', '36'].includes(duration) ? 'var(--primary)' : 'white',
                      cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500
                    }}>Custom</button>
                </div>
                {!['6', '12', '24', '36'].includes(duration) && (
                  <input type="number" placeholder="Enter duration in months"
                    value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} min="1" required />
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.88rem', fontWeight: 500, opacity: 0.8 }}>Additional Notes <span style={{ opacity: 0.5 }}>(optional)</span></label>
                <textarea rows={2} placeholder="Serial number, service helpline, extended warranty partner..."
                  value={notes} onChange={e => setNotes(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* STEP 3: Reference Uploads */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                💡 <strong>Optional:</strong> Process copies of documents now so they remain safely backed up under your profile for convenient retrieval.
              </p>

              {/* Receipt */}
              <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>Receipt / Bill Copy</strong>
                    <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>Proof of Purchase</span>
                  </div>
                  <input type="file" accept="image/*" id="receipt-upload" style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, 'receipt')} />
                  <label htmlFor="receipt-upload" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {receiptBase64 ? 'Replace' : 'Upload'}
                  </label>
                </div>
                {receiptMeta && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>✓ {receiptMeta.name}</span>
                    <span style={{ color: 'var(--primary)' }}>({receiptMeta.sizeKb} KB)</span>
                  </div>
                )}
              </div>

              {/* Invoice */}
              <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>Tax Invoice Copy</strong>
                    <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>Detailed retailer description</span>
                  </div>
                  <input type="file" accept="image/*" id="invoice-upload" style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, 'invoice')} />
                  <label htmlFor="invoice-upload" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {invoiceBase64 ? 'Replace' : 'Upload'}
                  </label>
                </div>
                {invoiceMeta && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>✓ {invoiceMeta.name}</span>
                    <span style={{ color: 'var(--primary)' }}>({invoiceMeta.sizeKb} KB)</span>
                  </div>
                )}
              </div>

              {/* Warranty Card */}
              <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block' }}>Warranty Card / Book Copy</strong>
                    <span style={{ fontSize: '0.78rem', opacity: 0.6 }}>Manufacturer policy and terms</span>
                  </div>
                  <input type="file" accept="image/*" id="card-upload" style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, 'card')} />
                  <label htmlFor="card-upload" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {warrantyCardBase64 ? 'Replace' : 'Upload'}
                  </label>
                </div>
                {warrantyCardMeta && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>✓ {warrantyCardMeta.name}</span>
                    <span style={{ color: 'var(--primary)' }}>({warrantyCardMeta.sizeKb} KB)</span>
                  </div>
                )}
              </div>

              {compressing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.85rem', opacity: 0.8 }}>
                  <style>{`@keyframes loader-spin { to { transform: rotate(360deg); } }`}</style>
                  <div style={{ border: '2px solid transparent', borderTop: '2px solid var(--primary)', borderRadius: '50%', width: '16px', height: '16px', animation: 'loader-spin 0.6s linear infinite' }} />
                  Processing and compressing document scans...
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Privacy & Disclaimer */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
              <div style={{
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)',
                padding: '1.25rem', borderRadius: '12px', color: 'white'
              }}>
                <h4 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  🛡️ Confidential Reference Guidelines & Disclaimer
                </h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', opacity: 0.85, display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li><strong>Personal Backup:</strong> These uploaded documents are stored purely for your convenient reference to read/download in the future.</li>
                  <li><strong>No Service Liability:</strong> Carpenterwala only stores this data securely. We are not liable or responsible for maintaining structural data backups or document validity.</li>
                  <li><strong>100% Account Restriction:</strong> All uploaded copies are fully private, strictly restricted to your logged-in customer account, and are **absolutely never** shared with handymen or any third parties.</li>
                  <li><strong>Smart Reminders:</strong> We will evaluate your warranty details and dispatch automated reminder alerts before your appliance's coverage expires!</li>
                </ul>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0', cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" checked={disclaimerAgreed} onChange={e => setDisclaimerAgreed(e.target.checked)}
                  style={{ marginTop: '0.2rem', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  I understand and agree that these uploaded files are strictly for reference purposes, and I confirm the accuracy of purchase data.
                </span>
              </label>

              <button type="submit" disabled={submitting || !disclaimerAgreed} className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                {submitting ? 'Saving Warranty Record…' : '✓ Securely Save Appliance Warranty'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Traversal Buttons */}
        {step < 4 && (
          <div style={{
            padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '1rem', justifyContent: 'flex-end'
          }}>
            {step > 1 && (
              <button onClick={handleBack} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
                Back
              </button>
            )}
            <button onClick={handleNext} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
              Next Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Preview uploaded Base64 documents Modal
function ViewWarrantyDocumentModal({ title, base64Data, onClose }) {
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = base64Data;
    // Format descriptive download name
    const sanitizedTitle = title.replace(/\s+/g, '_').toLowerCase();
    link.download = `warranty_${sanitizedTitle}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', backdropFilter: 'blur(5px)'
    }}>
      <div className="glass animate-fade-in" style={{
        width: '100%', maxWidth: '640px', borderRadius: '16px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8)', overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={downloadFile} className="btn btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
              📥 Download File
            </button>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: 'white', fontSize: '1.4rem',
              cursor: 'pointer', opacity: 0.6, lineHeight: 1
            }}>×</button>
          </div>
        </div>
        <div style={{ padding: '1.5rem', background: '#0e121a', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '60vh', overflowY: 'auto' }}>
          <img src={base64Data} alt={title} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} />
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', opacity: 0.6, fontSize: '0.8rem' }}>
          🔒 strictly confidential · available only to your personal Carpenterwala account
        </div>
      </div>
    </div>
  );
}

export default function BookingsDashboard() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab states: 'bookings' or 'warranties'
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Warranties states
  const [warranties, setWarranties] = useState([]);
  const [warrantiesLoading, setWarrantiesLoading] = useState(true);
  const [addWarrantyOpen, setAddWarrantyOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null); // { title, base64 }

  const [reviewModal, setReviewModal] = useState(null); // booking object
  const [rebookModal, setRebookModal] = useState(null); // booking object
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const router = useRouter();

  // Search & filter states inside warranties
  const [warrantySearch, setWarrantySearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem('customer_phone');
      const name = localStorage.getItem('customer_name');
      if (!phone) { router.push('/login'); return; }
      setCustomer({ phone, name });
      fetchBookings(phone);
      fetchWarranties(phone);
    }
  }, [router]);

  const fetchBookings = async (phone) => {
    try {
      const res = await fetch(`/api/customer/leads?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarranties = async (phone) => {
    setWarrantiesLoading(true);
    try {
      const res = await fetch(`/api/customer/warranties?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setWarranties(data.warranties || []);
      }
    } catch (err) {
      console.error('Error fetching warranties:', err);
    } finally {
      setWarrantiesLoading(false);
    }
  };

  const handleDeleteWarranty = async (id, applianceName) => {
    if (!confirm(`Are you sure you want to permanently remove your saved warranty record for "${applianceName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/customer/warranties?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWarranties(prev => prev.filter(w => w.id !== id));
      } else {
        alert('Failed to delete warranty. Try again.');
      }
    } catch {
      alert('Network error occurred.');
    }
  };

  const getStatus = (createdAt) => {
    const diffHours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    if (diffHours < 24) return { text: 'Quote Requested', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    if (diffHours < 48) return { text: 'Pro Contacting You', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' };
    return { text: 'Job Completed', color: '#10b981', bg: 'rgba(16,185,129,0.15)' };
  };

  const isCompleted = (createdAt) =>
    (new Date() - new Date(createdAt)) / (1000 * 60 * 60) >= 48;

  const handleReviewSubmitted = (bookingId) => {
    setReviewedIds(prev => new Set([...prev, bookingId]));
    setReviewModal(null);
  };

  const handleRebookSubmitted = () => {
    setRebookModal(null);
    if (customer && customer.phone) {
      fetchBookings(customer.phone);
    }
  };

  // Live calculation of remaining warranty
  const calculateWarrantyBadge = (startDateStr, durationMonths) => {
    if (!startDateStr || !durationMonths) {
      return { text: 'Unknown Coverage', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
    }
    const start = new Date(startDateStr);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + durationMonths);

    const today = new Date();
    const diffMs = expiry - today;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const monthsAgo = Math.abs(Math.floor(diffDays / 30));
      return {
        text: monthsAgo === 0 ? 'Expired recently' : `Expired ${monthsAgo} mo ago`,
        color: '#f87171',
        bg: 'rgba(239,68,68,0.12)',
        expired: true
      };
    } else if (diffDays <= 30) {
      return {
        text: `🚨 Expires in ${diffDays} days!`,
        color: '#fbbf24',
        bg: 'rgba(251,191,36,0.12)',
        expiringSoon: true
      };
    } else {
      const monthsRemaining = Math.floor(diffDays / 30);
      return {
        text: monthsRemaining === 0 ? `Expires in ${diffDays} days` : `🛡️ ${monthsRemaining} mo remaining`,
        color: '#34d399',
        bg: 'rgba(52,211,153,0.12)',
        active: true
      };
    }
  };

  const filteredWarranties = warranties.filter(w => {
    const matchesSearch = w.appliance_name.toLowerCase().includes(warrantySearch.toLowerCase()) ||
      (w.notes || '').toLowerCase().includes(warrantySearch.toLowerCase());
    const matchesCat = selectedCatFilter === 'All' || w.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  if (!customer) return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <p style={{ opacity: 0.8 }}>Redirecting to login...</p>
    </div>
  );

  return (
    <div className="container flex-col gap-8" style={{ padding: '3rem 0' }}>

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModal
          booking={reviewModal}
          customerName={customer.name}
          onClose={() => setReviewModal(null)}
          onSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Re-book Modal */}
      {rebookModal && (
        <RebookModal
          booking={rebookModal}
          customerName={customer.name}
          customerPhone={customer.phone}
          onClose={() => setRebookModal(null)}
          onSubmitted={handleRebookSubmitted}
        />
      )}

      {/* Add Warranty Modal */}
      {addWarrantyOpen && (
        <AddWarrantyModal
          customerPhone={customer.phone}
          onClose={() => setAddWarrantyOpen(false)}
          onSaved={() => {
            setAddWarrantyOpen(false);
            fetchWarranties(customer.phone);
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewDoc && (
        <ViewWarrantyDocumentModal
          title={previewDoc.title}
          base64Data={previewDoc.base64}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center flex-mobile-col gap-4"
        style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px' }}>CUSTOMER PORTAL</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.25rem' }}>Hello, {customer.name}!</h1>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Registered Mobile: +91 {customer.phone}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setAddWarrantyOpen(true)} className="btn btn-secondary" style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(59,130,246,0.4)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🛡️ Add Warranty
          </button>
          <Link href="/find-a-professional" className="btn btn-primary">+ Book Another Service</Link>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1px', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'bookings' ? 'var(--primary)' : 'white',
            borderBottom: activeTab === 'bookings' ? '2px solid var(--primary)' : '2px solid transparent',
            padding: '0.75rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
            opacity: activeTab === 'bookings' ? 1 : 0.6, transition: 'all 0.2s', outline: 'none'
          }}
        >
          📅 Booking History ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('warranties')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'warranties' ? 'var(--primary)' : 'white',
            borderBottom: activeTab === 'warranties' ? '2px solid var(--primary)' : '2px solid transparent',
            padding: '0.75rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
            opacity: activeTab === 'warranties' ? 1 : 0.6, transition: 'all 0.2s', outline: 'none'
          }}
        >
          🛡️ Appliance Warranties ({warranties.length})
        </button>
      </div>

      {/* RENDERING TAB CONTENT */}

      {/* ── BOOKING HISTORY TAB ── */}
      {activeTab === 'bookings' && (
        <>
          {/* Stats */}
          <div className="flex gap-4" style={{ flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { label: 'Total Jobs Booked', value: bookings.length, color: 'var(--primary)' },
              { label: 'Active / Pending', value: bookings.filter(b => !isCompleted(b.created_at)).length, color: 'var(--accent)' },
              { label: 'Completed', value: bookings.filter(b => isCompleted(b.created_at)).length, color: '#10b981' },
              { label: 'Reviews Given', value: reviewedIds.size, color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass" style={{ flex: 1, minWidth: '150px', padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ opacity: 0.7, fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>{label}</h3>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color }}>{value}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Your Booking History</h2>

            {loading ? (
              <div className="glass flex items-center justify-center" style={{ padding: '4rem', textAlign: 'center' }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : bookings.length === 0 ? (
              <div className="glass flex-col items-center justify-center" style={{ padding: '4rem 2rem', textAlign: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '3rem' }}>📭</span>
                <h3>No bookings found!</h3>
                <p style={{ opacity: 0.8, maxWidth: '500px', margin: '0 auto 1rem' }}>
                  You haven't booked any handyman services yet. Reach out to our verified pros to get started.
                </p>
                <Link href="/find-a-professional" className="btn btn-primary">Find a Professional Now</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map(booking => {
                  const status = getStatus(booking.created_at);
                  const completed = isCompleted(booking.created_at);
                  const reviewed = reviewedIds.has(booking.id);
                  return (
                    <div key={booking.id} className="glass" style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>

                        {/* Left: Pro info */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                          <img
                            src={booking.profiles?.avatar || `https://i.pravatar.cc/150?u=${booking.profiles?.name || 'unknown'}`}
                            alt={booking.profiles?.name || 'Pro'}
                            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1.2rem' }}>{booking.profiles?.name || 'Handyman Pro'}</h3>
                              <span className="text-gradient" style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.1rem 0.6rem', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
                                {booking.profiles?.trade || 'Handyman'}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '0.2rem' }}>
                              📍 {booking.profiles?.location || 'Bangalore'}
                            </p>
                            <div style={{ marginTop: '0.9rem' }}>
                              <span style={{ fontSize: '0.8rem', opacity: 0.55, fontWeight: 500, letterSpacing: '0.5px' }}>TASK:</span>
                              <p style={{ marginTop: '0.15rem', fontSize: '0.95rem' }}>{booking.task}</p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status + actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', minWidth: '190px' }}>
                          <div style={{
                            background: status.bg, color: status.color,
                            padding: '0.4rem 0.9rem', borderRadius: '20px',
                            fontSize: '0.82rem', fontWeight: 600,
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                          }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status.color }} />
                            {status.text}
                          </div>

                          <span style={{ fontSize: '0.78rem', opacity: 0.55 }}>
                            {new Date(booking.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>

                          {/* View Pro Profile */}
                          {booking.profiles?.slug && (
                            <Link href={`/${booking.profiles.slug}`}
                              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>
                              View Profile ↗
                            </Link>
                          )}

                          {/* Re-book Professional */}
                          {booking.profiles && (
                            <button
                              onClick={() => setRebookModal(booking)}
                              className="btn btn-primary"
                              style={{
                                fontSize: '0.8rem',
                                padding: '0.5rem 1rem',
                                marginTop: '0.5rem',
                                width: '100%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))'
                              }}
                            >
                              🔄 Re-book Professional
                            </button>
                          )}

                          {/* Leave a Review — only for completed jobs */}
                          {completed && (
                            reviewed ? (
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                color: '#34d399', fontSize: '0.85rem', fontWeight: 600,
                                background: 'rgba(52,211,153,0.1)', padding: '0.4rem 0.8rem',
                                borderRadius: '8px', marginTop: '0.5rem', width: '100%', justifyContent: 'center'
                              }}>
                                ✓ Review Submitted
                              </div>
                            ) : (
                              <button
                                onClick={() => setReviewModal(booking)}
                                style={{
                                  marginTop: '0.5rem', padding: '0.5rem 1rem',
                                  background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))',
                                  border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px',
                                  color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600,
                                  cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.25)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))'}
                              >
                                ⭐ Leave a Review
                              </button>
                            )
                          )}

                          {!completed && (
                            <button
                              onClick={() => alert(`We've notified ${booking.profiles?.name || 'the professional'}. They will contact you at +91 ${booking.phone}.`)}
                              className="btn btn-secondary"
                              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginTop: '0.5rem', width: '100%' }}
                            >
                              Request Call Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── APPLIANCE WARRANTIES TAB ── */}
      {activeTab === 'warranties' && (
        <div className="animate-fade-in flex flex-col gap-6">
          
          {/* Warranty Quick Stats Banner */}
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {[
              { label: 'Total Tracked Appliances', value: warranties.length, color: 'var(--primary)' },
              { label: 'Active Coverage', value: warranties.filter(w => {
                const b = calculateWarrantyBadge(w.warranty_start_date, w.warranty_duration_months);
                return b.active || b.expiringSoon;
              }).length, color: '#34d399' },
              { label: 'Expiring Soon (< 30 days)', value: warranties.filter(w => {
                const b = calculateWarrantyBadge(w.warranty_start_date, w.warranty_duration_months);
                return b.expiringSoon;
              }).length, color: '#fbbf24' },
              { label: 'Expired Records', value: warranties.filter(w => {
                const b = calculateWarrantyBadge(w.warranty_start_date, w.warranty_duration_months);
                return b.expired;
              }).length, color: '#f87171' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass" style={{ flex: 1, minWidth: '150px', padding: '1.25rem', textAlign: 'center' }}>
                <h3 style={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>{label}</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Controls: Search, filters and add button */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', gap: '1rem',
            alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '1.25rem', marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search appliance model, brand, or notes..."
                value={warrantySearch}
                onChange={e => setWarrantySearch(e.target.value)}
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: '20px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)',
                  color: 'white', fontSize: '0.88rem', flex: 1, minWidth: '200px', outline: 'none'
                }}
              />
              <select
                value={selectedCatFilter}
                onChange={e => setSelectedCatFilter(e.target.value)}
                style={{
                  padding: '0.6rem 1rem', borderRadius: '20px',
                  border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)',
                  color: 'white', fontSize: '0.88rem', cursor: 'pointer', outline: 'none'
                }}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setAddWarrantyOpen(true)}
              className="btn btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, var(--primary), var(--accent))'
              }}
            >
              🛡️ Add Appliance Warranty
            </button>
          </div>

          {/* Warranty Records Grid */}
          {warrantiesLoading ? (
            <div className="glass flex items-center justify-center" style={{ padding: '5rem', textAlign: 'center' }}>
              <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filteredWarranties.length === 0 ? (
            <div className="glass flex-col items-center justify-center" style={{ padding: '5rem 2rem', textAlign: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '3.5rem' }}>🛡️</span>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>No Appliance Warranties Logged</h3>
                <p style={{ opacity: 0.7, maxWidth: '520px', margin: '0.5rem auto 1.5rem', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  Keep track of all your household warranties (TV, Washing Machine, Phone, Iron Box, etc.) at one place. 
                  Securely upload reference documents to access them instantly when needed!
                </p>
                <button onClick={() => setAddWarrantyOpen(true)} className="btn btn-primary">
                  Register Your First Warranty
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
              {filteredWarranties.map(w => {
                const catInfo = CATEGORIES.find(c => c.id === w.category) || { emoji: '🔌', label: w.category, color: '#3b82f6' };
                const badge = calculateWarrantyBadge(w.warranty_start_date, w.warranty_duration_months);

                return (
                  <div key={w.id} className="glass animate-fade-in" style={{
                    borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid var(--glass-border)', position: 'relative'
                  }}>
                    {/* Top Accent Category Bar */}
                    <div style={{
                      padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{catInfo.emoji}</span> {w.category}
                      </span>
                      <span style={{
                        backgroundColor: badge.bg, color: badge.color,
                        padding: '0.3rem 0.75rem', borderRadius: '20px',
                        fontSize: '0.76rem', fontWeight: 700
                      }}>{badge.text}</span>
                    </div>

                    {/* Content Details */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'white' }}>{w.appliance_name}</h3>
                        {w.notes && (
                          <p style={{ fontSize: '0.85rem', opacity: 0.65, marginTop: '0.4rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                            "{w.notes}"
                          </p>
                        )}
                      </div>

                      <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem 0.5rem',
                        fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px'
                      }}>
                        <div>
                          <span style={{ opacity: 0.5, display: 'block' }}>📅 PURCHASED</span>
                          <strong style={{ opacity: 0.9 }}>
                            {w.purchase_date ? new Date(w.purchase_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </strong>
                        </div>
                        <div>
                          <span style={{ opacity: 0.5, display: 'block' }}>⏳ COVERAGE</span>
                          <strong style={{ opacity: 0.9 }}>{w.warranty_duration_months ? `${w.warranty_duration_months} Months` : 'N/A'}</strong>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={{ opacity: 0.5, display: 'block' }}>🛡️ WARRANTY START</span>
                          <strong style={{ opacity: 0.9 }}>
                            {w.warranty_start_date ? new Date(w.warranty_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </strong>
                        </div>
                      </div>

                      {/* Documents Status Icons */}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', alignItems: 'center' }}>
                        <span style={{ opacity: 0.6 }}>Attachments:</span>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                          <span style={{
                            opacity: w.receipt_copy ? 1 : 0.25, color: w.receipt_copy ? '#34d399' : 'white',
                            textDecoration: w.receipt_copy ? 'none' : 'line-through'
                          }}>🧾 Bill</span>
                          <span style={{
                            opacity: w.invoice_copy ? 1 : 0.25, color: w.invoice_copy ? '#34d399' : 'white',
                            textDecoration: w.invoice_copy ? 'none' : 'line-through'
                          }}>📄 Invoice</span>
                          <span style={{
                            opacity: w.warranty_card_copy ? 1 : 0.25, color: w.warranty_card_copy ? '#34d399' : 'white',
                            textDecoration: w.warranty_card_copy ? 'none' : 'line-through'
                          }}>🪪 Card</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div style={{
                      padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.15)',
                      borderTop: '1px solid var(--glass-border)', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {w.receipt_copy && (
                          <button
                            onClick={() => setPreviewDoc({ title: `${w.appliance_name} - Receipt/Bill`, base64: w.receipt_copy })}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', borderRadius: '6px' }}
                          >
                            🧾 Bill
                          </button>
                        )}
                        {w.invoice_copy && (
                          <button
                            onClick={() => setPreviewDoc({ title: `${w.appliance_name} - Invoice`, base64: w.invoice_copy })}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', borderRadius: '6px' }}
                          >
                            📄 Invoice
                          </button>
                        )}
                        {w.warranty_card_copy && (
                          <button
                            onClick={() => setPreviewDoc({ title: `${w.appliance_name} - Warranty Card`, base64: w.warranty_card_copy })}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem', borderRadius: '6px' }}
                          >
                            🪪 Card
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteWarranty(w.id, w.appliance_name)}
                        style={{
                          background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '6px',
                          color: '#f87171', padding: '0.35rem 0.6rem', cursor: 'pointer',
                          fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
