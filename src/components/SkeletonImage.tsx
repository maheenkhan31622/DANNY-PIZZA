import { useState } from 'react';
import { Flame } from 'lucide-react';

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function SkeletonImage({
  src,
  alt,
  className = '',
  priority = false,
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-red-100/80 dark:bg-[#230B0F]">
      {!loaded && !failed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-100 via-red-50 to-red-100 dark:from-[#1f0a0d] dark:via-[#331117] dark:to-[#1f0a0d]"
        />
      )}

      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-red-100 to-rose-200 dark:from-[#260B10] dark:to-[#140508] text-red-700 dark:text-red-300 p-3 text-center">
          <Flame className="h-7 w-7 opacity-80" />
          <span className="text-xs font-semibold line-clamp-2">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`${className} transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
