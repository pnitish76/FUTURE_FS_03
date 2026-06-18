import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart items on start
  useEffect(() => {
    const storedCart = localStorage.getItem('jbCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to load cart items from localStorage:', e);
      }
    }
  }, []);

  // Save cart items whenever cart updates
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('jbCart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.product._id === product._id);

    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      saveCart(updatedItems);
    } else {
      const newItem = {
        product: {
          _id: product._id,
          title: product.title,
          category: product.category,
          price: product.price,
          image: product.image,
          stock: product.stock
        },
        quantity
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.product._id !== productId);
    saveCart(updatedItems);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.product._id === productId
        ? { ...item, quantity }
        : item
    );
    saveCart(updatedItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
