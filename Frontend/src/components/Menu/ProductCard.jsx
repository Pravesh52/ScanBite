import React from "react";
import useCart from "../../hooks/useCart";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const cartItem = cartItems.find((item) => item.name === product.name);
  const qty = cartItem ? cartItem.qty : 0;

  if (!product.available) {
    return (
      <div className="product-card out-of-stock">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">₹{product.price}</p>
          <button className="btn-out-of-stock" disabled>
            Out of Stock ❌
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <div className="product-controls">
          {qty === 0 ? (
            <button className="btn-add" onClick={() => addToCart(product)}>
              + Add
            </button>
          ) : (
            <div className="qty-row">
              <button className="qty-btn" onClick={() => removeFromCart(product.name)}>−</button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={() => addToCart(product)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;