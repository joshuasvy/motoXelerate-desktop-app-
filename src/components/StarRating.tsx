type StarRatingProps = {
  rating: number;
  size?: number; // in pixels
};

export default function StarRating({ rating, size = 20 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <img
        key={`full-${i}`}
        src="/images/icons/star.png"
        alt="Full Star"
        style={iconStyle}
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <img
        key="half"
        src="/images/icons/star-2.png"
        alt="Half Star"
        style={iconStyle}
      />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <img
        key={`empty-${i}`}
        src="/images/icons/emptystar.png"
        alt="Empty Star"
        style={iconStyle}
      />
    );
  }

  return <div className="flex gap-1">{stars}</div>;
}
