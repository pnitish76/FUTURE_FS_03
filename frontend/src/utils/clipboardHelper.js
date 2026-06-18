/**
 * Clipboard helper utility for web applications.
 * Handles cross-origin image fetching, canvas PNG conversion,
 * and copying actual image files to the system clipboard.
 */

export const copyImageToClipboard = async (imageUrl) => {
  if (!imageUrl) return false;

  try {
    // 1. Fetch the image
    const response = await fetch(imageUrl, { mode: 'cors' });
    const originalBlob = await response.blob();

    // 2. If it is already a PNG, we can try to copy it directly
    if (originalBlob.type === 'image/png') {
      try {
        const item = new ClipboardItem({ 'image/png': originalBlob });
        await navigator.clipboard.write([item]);
        return true;
      } catch (err) {
        console.warn('Direct PNG copy failed, falling back to canvas conversion:', err);
      }
    }

    // 3. Convert to PNG via canvas (handles JPG/JPEG/WebP and ensures clipboard compatibility)
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(async (pngBlob) => {
            if (!pngBlob) {
              resolve(false);
              return;
            }
            try {
              const item = new ClipboardItem({ 'image/png': pngBlob });
              await navigator.clipboard.write([item]);
              resolve(true);
            } catch (err) {
              console.error('Clipboard write failed:', err);
              resolve(false);
            }
          }, 'image/png');
        } catch (err) {
          console.error('Canvas processing failed:', err);
          resolve(false);
        }
      };

      img.onerror = () => {
        console.error('Failed to load image for clipboard copy');
        resolve(false);
      };

      // Create a URL for the blob to load into the Image object
      img.src = URL.createObjectURL(originalBlob);
    });
  } catch (error) {
    console.error('Error copying image to clipboard:', error);
    return false;
  }
};
