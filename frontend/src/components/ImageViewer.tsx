import { useState } from 'react';
import '../styles/ImageViewer.css';

interface ImageViewerProps {
  imageUrl: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
}

function ImageViewer({ imageUrl, alt, selected, onSelect }: ImageViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log('ImageViewer rendering:', alt, 'URL:', imageUrl);

  return (
    <div
      className={`image-wrapper ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="image-scroll">
        {loading && !error && (
          <div className="image-loading">Loading image...</div>
        )}
        {error && (
          <div className="image-error">
            Failed to load image
            <button onClick={(e) => {
              e.stopPropagation();
              setError(false);
              setLoading(true);
            }}>
              Retry
            </button>
          </div>
        )}
        <img
          className="image"
          src={imageUrl}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          style={{ display: error ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}

export default ImageViewer;

