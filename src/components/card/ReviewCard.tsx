import { useState, useEffect } from "react";
import axios from "axios";

type Review = {
  _id: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  rate: number;
  review: string;
  createdAt: string;
};

export default function ReviewCard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "https://api-motoxelerate.onrender.com/api/review"
      );

      const reviewsArray = Array.isArray(res.data.reviews)
        ? res.data.reviews
        : Array.isArray(res.data)
        ? res.data
        : [];

      setReviews(reviewsArray);
    } catch (err: any) {
      console.error("❌ Error fetching reviews:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Calculate average rating
  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rate || 0), 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="bg-white px-5 py-4 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Reviews</p>
        <img src="/images/icons/reviews.png" alt="Reviews" className="w-8" />
      </div>

      <p className="text-xl font-semibold mt-3">
        {average} <span className="text-gray-500">({reviews.length})</span>
      </p>

      <div className="mt-3 space-y-3">
        {loading ? (
          <p className="text-gray-500 italic">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          // 👇 Only show the 2 most recent reviews
          reviews
            .slice(0, 2)
            .map((review) => (
              <ReviewItem
                key={review._id}
                name={
                  review.userId
                    ? `${review.userId.firstName || ""} ${
                        review.userId.lastName || ""
                      }`
                    : "Anonymous"
                }
                text={review.review}
                rate={review.rate}
              />
            ))
        )}
      </div>
    </div>
  );
}

function ReviewItem({
  name,
  text,
  rate,
}: {
  name: string;
  text: string;
  rate: number;
}) {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 !== 0;

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
