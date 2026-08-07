import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  showScore?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  reviewCount,
  size = 'sm',
  showCount = true,
  showScore = true,
  className = ''
}) => {
  const safeCount = reviewCount !== undefined ? Number(reviewCount) : undefined;
  const safeRating = safeCount === 0 ? 0 : Math.min(5, Math.max(0, Number(rating) || 0));

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const starClass = starSizes[size] || starSizes.sm;

  if (safeCount === 0) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <div className="flex items-center gap-0.5 text-gray-300" aria-label="No reviews yet">
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Star key={starIndex} className={`${starClass} text-gray-300 fill-gray-100`} />
          ))}
        </div>
        {showScore && (
          <span className={`font-semibold text-[#1A1A1A] dark:text-[#C5A059] ${size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[11px]'}`}>
            No reviews
          </span>
        )}
        {showCount && (
          <span className={`text-[#C5A059] font-semibold ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}>
            (0)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* 5 Stars */}
      <div className="flex items-center gap-0.5 text-[#C5A059]" aria-label={`Rated ${safeRating.toFixed(1)} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = safeRating >= starIndex;
          const half = safeRating >= starIndex - 0.5 && safeRating < starIndex;

          return (
            <Star
              key={starIndex}
              className={`${starClass} transition-colors ${
                filled
                  ? 'fill-[#C5A059] text-[#C5A059]'
                  : half
                  ? 'fill-[#C5A059]/50 text-[#C5A059]'
                  : 'text-gray-300 dark:text-gray-600 fill-gray-100 dark:fill-[#2A2A2A]'
              }`}
            />
          );
        })}
      </div>

      {/* Numeric Score */}
      {showScore && (
        <span className={`font-bold text-[#1A1A1A] dark:text-[#C5A059] ${size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'}`}>
          {safeRating.toFixed(1)}
        </span>
      )}

      {/* Review Count */}
      {showCount && safeCount !== undefined && (
        <span className={`text-[#C5A059] font-bold ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}>
          ({safeCount})
        </span>
      )}
    </div>
  );
};
