// src/pages/ProductList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  averageRating: number;
  description: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });

  const fetchProducts = () => {
    axios
      .get("https://product-review-server-cw39.onrender.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const searchProducts = (q: string) => {
    axios
      .get(`https://product-review-server-cw39.onrender.com/search?q=${q}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newProduct,
      price: parseFloat(newProduct.price),
    };
    try {
      if (isEdit && editId) {
        await axios.put(
          `https://product-review-server-cw39.onrender.com/${editId}`,
          payload
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(
          "https://product-review-server-cw39.onrender.com/products",
          {
            ...payload,
            averageRating: 0,
            dateAdded: new Date(),
          }
        );
        toast.success("Product added successfully!");
      }
      setNewProduct({ name: "", description: "", category: "", price: "" });
      setShowForm(false);
      setIsEdit(false);
      setEditId(null);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length === 0) {
      fetchProducts();
    } else {
      searchProducts(val);
    }
  };

  const openEditForm = (product: Product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
    });
    setEditId(product._id);
    setIsEdit(true);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded p-6 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">All Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleSearch}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => {
            setShowForm(true);
            setIsEdit(false);
            setNewProduct({
              name: "",
              description: "",
              category: "",
              price: "",
            });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">
              {isEdit ? "Edit Product" : "New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                className="block w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                required
                className="block w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
                className="block w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
                className="block w-full border border-gray-300 rounded px-3 py-2"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {products.map((p) => (
          <li
            key={p._id}
            className="p-4 border border-gray-200 rounded bg-gray-50"
          >
            <Link
              to={`/products/${p._id}`}
              className="text-lg font-medium text-blue-600 hover:underline"
            >
              {p.name}
            </Link>
            <p>Category: {p.category}</p>
            <p>Price: ${p.price.toFixed(2)}</p>
            <p>Rating: {p.averageRating.toFixed(1)}</p>
            <button
              onClick={() => openEditForm(p)}
              className="text-blue-600 text-sm hover:underline mt-2"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
