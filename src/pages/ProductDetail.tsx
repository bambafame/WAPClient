import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import type { Product } from "../context/ProductContext";
import { toast } from "react-toastify";

interface Review {
  _id: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchProduct = async () => {
    const res = await api.get(`/products`);
    const found = res.data.find((p: Product) => p._id === id);
    setProduct(found);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  const handleDelete = async (reviewId: string) => {
    await api.delete(`/reviews/${id}/${reviewId}`);
    toast.success("Review deleted.");
    fetchReviews();
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  return product ? (
    <div className="bg-white rounded p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-blue-800">{product.name}</h2>
      <p className="mb-2 text-gray-700">{product.description}</p>
      <p className="mb-2 text-sm text-gray-600">Category: {product.category}</p>
      <p className="mb-4 text-sm text-gray-600">
        Average Rating:{" "}
        <span className="text-yellow-500 font-semibold">
          {product.averageRating.toFixed(1)}
        </span>
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-4">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">
          No reviews yet. Be the first to write one!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-gray-100 p-4 rounded-lg shadow-sm relative"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-gray-800">
                  {r.author}
                </h4>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  {Array.from({ length: r.rating }, (_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-2 text-sm">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                Reviewed on {new Date(r.date).toLocaleDateString()}
              </p>
              <div className="absolute top-2 right-2 flex gap-2">
                <Link
                  to={`/products/${id}/review?edit=${r._id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        to={`/products/${id}/review`}
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Review
      </Link>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ProductDetail;
