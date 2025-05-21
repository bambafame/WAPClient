import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (editId) {
      api.get(`/reviews/${id}`).then((res) => {
        const review = res.data.find((r: any) => r._id === editId);
        if (review) {
          setAuthor(review.author);
          setComment(review.comment);
          setRating(review.rating);
        }
      });
    }
  }, [editId, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { author, comment, rating };

    if (editId) {
      await api.put(`/reviews/${id}/${editId}`, data);
    } else {
      await api.post(`/reviews/${id}`, data);
    }

    toast.success("Review saved successfully!");
    navigate(`/products/${id}`);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-800">
        {editId ? "Edit Review" : "Add Review"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          required
          className="block border border-gray-300 rounded px-3 py-2 w-full"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your comment"
          className="block border border-gray-300 rounded px-3 py-2 w-full"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="block border border-gray-300 rounded px-3 py-2 w-full"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div className="flex justify-between items-center">
          <Link
            to={`/products/${id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to product details
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
