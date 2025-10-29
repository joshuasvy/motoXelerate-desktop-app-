const rating = 4.5;
const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 !== 0;

const reviews = [
  {
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit consigeo amo wlent",
  },
  {
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit consigeo amo wlent",
  },
];

export default function ReviewCard() {
  return (
    <div className="bg-white px-5 py-4 rounded-md shadow-lg">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Reviews</p>
        <img src="/images/icons/reviews.png" alt="Reviews" className="w-8" />
      </div>

      <p className="text-xl font-semibold mt-3">
        4.8 <span className="text-gray-500">(201)</span>
      </p>

      <div className="mt-3 space-y-3">
        {reviews.map((review, index) => (
          <ReviewItem key={index} name={review.name} text={review.text} />
        ))}
      </div>
    </div>
  );
}

function ReviewItem({ name, text }: { name: string; text: string }) {
  return (
    <div className="rounded shadow-md p-3">
      <div className="flex items-center gap-3 mb-1">
        <p className="text-md font-medium">{name}</p>
        <div className="flex items-center gap-1">
          {[...Array(fullStars)].map((_, i) => (
            <img
              key={`full-${i}`}
              src="/images/icons/star.png"
              alt="Full Star"
              className="w-3"
            />
          ))}
          {hasHalfStar && (
            <img
              src="/images/icons/star2.png"
              alt="Half Star"
              className="w-3"
            />
          )}
        </div>
      </div>
      <p className="px-1 text-sm truncate whitespace-nowrap overflow-hidden">
        {text}
      </p>
    </div>
  );
}
