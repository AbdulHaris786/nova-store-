
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import "./Header.css";

export default function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        NOVA<span>STORE</span>
      </Link>

      <nav className="header-actions">
        <Link to="/wishlist" className="header-link">
          <Heart
  size={20}
  fill={wishlistItems.length > 0 ? "#e53935" : "none"}
  color={wishlistItems.length > 0 ? "#e53935" : "currentColor"}
/>
          <span>Wishlist</span>
          {wishlistItems.length > 0 && (
            <span className="header-badge">{wishlistItems.length}</span>
          )}
        </Link>

        <Link to="/cart" className="header-link cart-link">
          <ShoppingBag size={21} />
          <span>Cart</span>
          <span className="header-badge">{cartCount}</span>
        </Link>
      </nav>
    </header>
  );
}
