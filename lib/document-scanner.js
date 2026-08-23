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
 * Optimizes document image for maximum text readability:
 * - Upscales limit to 1600px width/height (instead of 600px)
 * - Retains high JPEG quality (0.85)
 * - Returns base64 dataUrl, sharpness score, and client validation warnings
 */
export function processDocumentImage(file, maxDimension = 1600, quality = 0.85) {
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

          // Scale proportionally to maxDimension (e.g. 1600px)
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

          // Calculate quality metrics
          const sharpness = calculateSharpness(canvas);
          const brightness = calculateBrightness(canvas);

          // Generate crisp JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Pre-flight checks
          const isBlurry = sharpness < 15; // Low variance = blurry photo
          const isTooDark = brightness < 25; // Too dark
          const isTooSmall = (img.naturalWidth && img.naturalWidth < 300) || (img.naturalHeight && img.naturalHeight < 300);

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
