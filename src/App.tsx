// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ReviewForm from "./pages/ReviewForm";
import { ProductProvider } from "./context/ProductContext";
import logo from "./assets/logo.png";

function App() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
              <h1 className="text-2xl font-bold text-blue-800">
                Product Review Platform
              </h1>
            </div>
            <nav className="space-x-4">
              <Link
                to="/"
                className="text-blue-600 font-medium hover:underline"
              >
                Home
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/review" element={<ReviewForm />} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-12 py-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Product Review Platform. All rights
          reserved.
        </footer>
      </div>
    </ProductProvider>
  );
}

export default App;
