
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import "./Checkout.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const total = subtotal + shipping;

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(clearCart());
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <section className="checkout-form">
          <h1>Thank you!</h1>
          <p>Your order has been submitted successfully.</p>
          <button
            className="place-order-button"
            onClick={() => navigate("/")}
          >
            Continue shopping
          </button>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <h1>Your cart is empty</h1>
        <button
          className="place-order-button"
          onClick={() => navigate("/")}
        >
          Continue shopping
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <button className="checkout-back" onClick={() => navigate("/cart")}>
        ← Back to cart
      </button>

      <h1>Checkout</h1>
      <p className="checkout-subtitle">
        Enter your delivery details and review your order.
      </p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>

          <label>
            Full name
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength={10}
              autoComplete="tel"
              required
            />
          </label>

          <label>
            Delivery address
            <textarea
              name="address"
              placeholder="House number, street and area"
              autoComplete="street-address"
              rows={3}
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              type="text"
              placeholder="Enter your city"
              autoComplete="address-level2"
              required
            />
          </label>

          <label>
            PIN code
            <input
              name="pincode"
              type="text"
              placeholder="6-digit PIN code"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="postal-code"
              required
            />
          </label>

          <button className="place-order-button" type="submit">
            Place demo order · {formatPrice(total)}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>

          {items.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {item.title} × {item.quantity}
              </span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
          </div>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <p>Payment Checkout.</p>
        </aside>
      </div>
    </main>
  );
}
