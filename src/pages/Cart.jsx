
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import "./Cart.css";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 5;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={36} />
          </div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button
            className="cart-primary-button"
            onClick={() => navigate("/")}
          >
            Continue shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <button className="cart-back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Continue shopping
      </button>

      <div className="cart-heading">
        <div>
          <p className="eyebrow">YOUR SELECTION</p>
          <h1>Shopping cart</h1>
          <p>{items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</p>
        </div>

        <button
          className="clear-cart-button"
          onClick={() => dispatch(clearCart())}
        >
          <Trash2 size={16} />
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="cart-item-details">
                <p className="cart-item-category">{item.category}</p>
                <h2>{item.title}</h2>
                <p className="cart-item-price">{formatPrice(item.price)}</p>

                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button
                      aria-label={`Decrease ${item.title} quantity`}
                      onClick={() => dispatch(decrease(item.id))}
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      aria-label={`Increase ${item.title} quantity`}
                      onClick={() => dispatch(increase(item.id))}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    className="remove-item-button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>

              <strong className="cart-line-total">
                {formatPrice(item.price * item.quantity)}
              </strong>
            </article>
          ))}
        </section>

        <aside className="order-summary">
          <h2>Order summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? "free-shipping" : ""}>
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>

          {subtotal < 100 && (
            <p className="shipping-note">
              Add {formatPrice(100 - subtotal)} more for free shipping.
            </p>
          )}

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button
  className="checkout-button"
  onClick={() => navigate("/checkout")}
>
  Proceed to checkout
</button>

          <p className="secure-checkout">Your items are saved in your cart.</p>
        </aside>
      </div>
    </main>
  );
}
