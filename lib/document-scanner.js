/**
 * Document Scanner & Quality Engine
 * High-fidelity resizing (1600px @ 85% quality) + Canvas-based blur/sharpness detection
 */

/**
 * Calculates sharpness score of an image canvas using Laplacian variance estimation.
 * Returns a score between 0 (completely blurry) and 100+ (crisp and sharp).
 */
export function calculateSharpness(canvas) {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 50;

    // Sample a center region (320x320 or scaled) for fast calculation
    const sampleW = Math.min(320, canvas.width);
    const sampleH = Math.min(320, canvas.height);
    const startX = Math.floor((canvas.width - sampleW) / 2);
    const startY = Math.floor((canvas.height - sampleH) / 2);

    const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
    const pixels = imgData.data;

    // Convert sample to grayscale
    const gray = new Float32Array(sampleW * sampleH);
    for (let i = 0, j = 0; i < pixels.length; i += 4, j++) {
      gray[j] = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
    }

    // Compute Laplacian kernel variance: [0, 1, 0], [1, -4, 1], [0, 1, 0]
    let sum = 0;
    let sumSq = 0;
    let count = 0;

    for (let y = 1; y < sampleH - 1; y++) {
      for (let x = 1; x < sampleW - 1; x++) {
        const idx = y * sampleW + x;
        const laplacian =
          gray[idx - sampleW] +
          gray[idx + sampleW] +
          gray[idx - 1] +
          gray[idx + 1] -
          4 * gray[idx];

        sum += laplacian;
        sumSq += laplacian * laplacian;
        count++;
      }
    }

    if (count === 0) return 50;
    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);

    return Math.round(variance);
  } catch (err) {
    console.warn('Sharpness calculation error:', err);
    return 50;
  }
}

/**
 * Calculates average brightness (0-255).
 */
export function calculateBrightness(canvas) {
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 128;

    const sampleW = Math.min(100, canvas.width);
    const sampleH = Math.min(100, canvas.height);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const pixels = imgData.data;

    let totalLum = 0;
    const totalPixels = sampleW * sampleH;
    for (let i = 0; i < pixels.length; i += 4) {
      totalLum += (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
    }
    return Math.round(totalLum / totalPixels);
  } catch {
    return 128;
  }
}

/**
 * Draws a sleek, translucent "carpenterwala.com" branding badge in the bottom-right corner of the canvas.
 */
export function applyWatermark(canvas, text = 'carpenterwala.com') {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Proportionally scale font size relative to image width (between 13px and 36px)
    const fontSize = Math.max(13, Math.min(36, Math.round(canvas.width * 0.026)));
    const padX = Math.round(fontSize * 0.75);
    const padY = Math.round(fontSize * 0.42);
    const margin = Math.max(12, Math.round(canvas.width * 0.02));

    ctx.save();
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const metrics = ctx.measureText(text);
    const pillWidth = Math.round(metrics.width + (padX * 2));
    const pillHeight = Math.round(fontSize + (padY * 2));
    const pillX = canvas.width - pillWidth - margin;
    const pillY = canvas.height - pillHeight - margin;
    const radius = Math.round(pillHeight / 2);

    // Draw frosted translucent rounded pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.58)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, radius);
    } else {
      // Fallback for older canvas implementations
      ctx.moveTo(pillX + radius, pillY);
      ctx.lineTo(pillX + pillWidth - radius, pillY);
      ctx.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
      ctx.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
      ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
      ctx.lineTo(pillX + radius, pillY + pillHeight);
      ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
      ctx.lineTo(pillX, pillY + radius);
      ctx.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw crisp white text with subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, pillX + (pillWidth / 2), pillY + (pillHeight / 2) + 0.5);

    ctx.restore();
  } catch (err) {
    console.warn('Failed to apply watermark:', err);
  }
}

/**
 * Optimizes image with proportional scaling:
 * - Upscales limit to maxDimension (e.g. 1200px or 1600px)
 * - Retains high JPEG quality (0.85)
 * - Optionally burns "carpenterwala.com" watermark badge into pixels
 * - Returns base64 dataUrl, sharpness score, and client validation metrics
 */
export function processDocumentImage(file, maxDimension = 1600, quality = 0.85, watermark = false) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Scale proportionally to maxDimension
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round(height * (maxDimension / width));
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round(width * (maxDimension / height));
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Canvas rendering context unavailable.'));
          }

          // Draw scaled high resolution image
          ctx.drawImage(img, 0, 0, width, height);

          // Calculate quality metrics before watermark
          const sharpness = calculateSharpness(canvas);
          const brightness = calculateBrightness(canvas);

          // Pre-flight checks
          const isBlurry = sharpness < 15; // Low variance = blurry photo
          const isTooDark = brightness < 25; // Too dark
          const isTooSmall = (img.naturalWidth && img.naturalWidth < 300) || (img.naturalHeight && img.naturalHeight < 300);

          // Apply "carpenterwala.com" watermark if requested (for public portfolio & avatar)
          if (watermark) {
            applyWatermark(canvas, 'carpenterwala.com');
          }

          // Generate crisp JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);

          resolve({
            dataUrl,
            width,
            height,
            sharpness,
            brightness,
            isBlurry,
            isTooDark,
            isTooSmall,
            fileSizeBytes: Math.round((dataUrl.length * 3) / 4)
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

