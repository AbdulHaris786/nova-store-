
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../redux/cartSlice";
import { ShoppingCart, Star, ArrowLeft } from "lucide-react";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.products.items.find((item) => item.id === Number(id))
  );

  const status = useSelector((state) => state.products.status);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  if (status === "loading" || status === "idle") {
    return <div className="page-message">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="page-message">
        <p>Unable to load this product.</p>
        <button className="primary-button" onClick={() => navigate("/")}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <main className="details-page">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Back to shop
      </button>

      <section className="details-card">
        <div className="details-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="details-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>

          <div className="details-rating">
            <Star size={17} fill="currentColor" />
            <strong>{product.rating?.rate ?? "New"}</strong>
            <span>({product.rating?.count ?? 0} reviews)</span>
          </div>

          <p className="details-price">{formatPrice(product.price)}</p>

          <p className="details-description">{product.description}</p>

          <div className="quantity-control">
            <span>Quantity</span>

            <div className="quantity-buttons">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <strong>{quantity}</strong>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="details-add-button"
            onClick={() => {
              dispatch(addToCart({ product, quantity }));
              navigate("/cart");
            }}
          >
            <ShoppingCart size={18} />
            Add to Cart · {formatPrice(product.price * quantity)}
          </button>
        </div>
      </section>
    </main>
  );
}
