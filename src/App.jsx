
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { toggleWishlist } from "./redux/wishlistSlice";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <main className="page-message">
        <h2>Your wishlist is empty</h2>
        <p>Save your favourite products to find them here.</p>
        <button className="primary-button" onClick={() => navigate("/")}>
          Explore products
        </button>
      </main>
    );
  }

  return (
    <main className="shop-page">
      <section className="shop-heading">
        <div>
          <p className="eyebrow">YOUR FAVOURITES</p>
          <h1>My Wishlist</h1>
          <p className="shop-subtitle">
            {wishlistItems.length} saved products
          </p>
        </div>
      </section>

      <section className="product-grid">
        {wishlistItems.map((product) => (
          <article className="product-card" key={product.id}>
            <div
              className="product-image clickable-title"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.title} />
            </div>

            <div className="product-info">
              <p className="product-category">{product.category}</p>
              <h2
                className="clickable-title"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.title}
              </h2>

              <div className="product-bottom">
                <strong>{formatPrice(product.price)}</strong>
                <button
                  className="add-button"
                  onClick={() => dispatch(toggleWishlist(product))}
                >
                  Remove from wishlist
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}