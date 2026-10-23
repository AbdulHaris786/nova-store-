
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { toggleWishlist } from "../redux/wishlistSlice";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const { items, status, error } = useSelector(
    (state) => state.products
  );
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);

  const categories = [
    "All",
    ...new Set(items.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let products = [...items];

    if (selectedCategory !== "All") {
      products = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOrder === "low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [items, selectedCategory, sortOrder]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  const getQuantity = (id) =>
    cartItems.find((item) => item.id === id)?.quantity || 0;

  if (status === "loading" || status === "idle") {
    return <div className="page-message">Loading products...</div>;
  }

  if (status === "failed") {
    return (
      <div className="page-message">
        <p>{error || "Unable to load products."}</p>
        <button
          className="primary-button"
          onClick={() => dispatch(fetchProducts())}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <main className="shop-page">
      <section className="shop-heading">
        <div>
          <p className="eyebrow">YOUR EVERYDAY SHOP</p>
          <h1>Find your next favourite.</h1>
          <p className="shop-subtitle">
            Explore our collection of handpicked products.
          </p>
        </div>

        <div className="product-count">
          <ShoppingCart size={18} />
          <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} items in cart</span>
        </div>
      </section>

      <section className="shop-toolbar">
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-chip ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <select
          className="sort-select"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Sort products by price"
        >
          <option value="default">Sort by: Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </section>

      <p className="results-count">
        Showing {filteredProducts.length} products
      </p>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            
<div className="product-image">
  <img src={product.image} alt={product.title} />

  <button
    className={`wishlist-button ${
      wishlistItems.some((item) => item.id === product.id) ? "active" : ""
    }`}
    onClick={() => dispatch(toggleWishlist(product))}
    aria-label="Toggle wishlist"
    title="Add or remove from wishlist"
  >
    <Heart
      size={19}
      fill={
        wishlistItems.some((item) => item.id === product.id)
          ? "currentColor"
          : "none"
      }
    />
  </button>
</div>


            <div className="product-info">
              <p className="product-category">{product.category}</p>
             <h2
  title={product.title}
  className="clickable-title"
  onClick={() => navigate(`/product/${product.id}`)}
>
  {product.title}
</h2>

              <div className="product-rating">
                <Star size={15} fill="currentColor" />
                <span>{product.rating?.rate ?? "New"}</span>
                <span className="rating-count">
                  ({product.rating?.count ?? 0})
                </span>
              </div>

              
<div className="product-bottom">
  <strong>{formatPrice(product.price)}</strong>

  {getQuantity(product.id) === 0 ? (
    <button
      className="add-button"
      onClick={() =>
        dispatch(addToCart({ product, quantity: 1 }))
      }
    >
      Add to cart
    </button>
  ) : (
    <div className="product-quantity">
      <button
        onClick={() =>
          dispatch({ type: "cart/decrease", payload: product.id })
        }
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span>{getQuantity(product.id)}</span>

      <button
        onClick={() =>
          dispatch({ type: "cart/increase", payload: product.id })
        }
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )}
</div>

            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
