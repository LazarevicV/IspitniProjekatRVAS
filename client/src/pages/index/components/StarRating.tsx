import React from "react";

interface StarRatingProps {
  grade: number;
  maxGrade?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ grade, maxGrade = 5 }) => {
  return (
    <div className="flex">
      {[...Array(maxGrade)].map((_, index) => (
        <svg
          key={index}
          className={`w-6 h-6 ${
            index < grade ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927C9.198 2.383 9.613 2 10 2s.801.383.951.927l1.31 4.287h4.456c.598 0 1.09.436 1.208 1.017.12.58-.188 1.175-.727 1.42l-3.618 1.612 1.31 4.287c.15.545-.024 1.115-.451 1.437-.428.323-1.037.337-1.484.035L10 13.973l-3.595 2.05c-.447.302-1.056.288-1.484-.035-.427-.322-.6-.892-.451-1.437l1.31-4.287-3.618-1.612c-.539-.245-.846-.84-.727-1.42.118-.581.61-1.017 1.208-1.017h4.456l1.31-4.287z" />
        </svg>
      ))}
    </div>
  );
};

export { StarRating };
