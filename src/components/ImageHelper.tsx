import React, { useState } from 'react';

interface ImageHelperProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  className?: string;
}

export default function ImageHelper({ src, alt, fallbackText, className = '', ...props }: ImageHelperProps & { src?: string; alt?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative bg-slate-100 flex items-center justify-center overflow-hidden ${(!loaded && !src) ? 'border border-dashed border-slate-300' : ''} ${className}`}>
      {(!loaded || error) && (!src || error) && (
        <span className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs font-medium p-4 text-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          {fallbackText || `Replace with: ${src}`}
        </span>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${error ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            setLoaded(true);
            setError(false);
          }}
          onError={() => {
            setError(true);
            setLoaded(false);
          }}
          {...props}
        />
      )}
    </div>
  );
}
