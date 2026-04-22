import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (it: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: any) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("sl_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sl_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (it: CartItem) => {
    setItems((prev) => {
      const found = prev.find((p) => p.productId === it.productId);
      if (found) {
        return prev.map((p) =>
          p.productId === it.productId ? { ...p, qty: p.qty + it.qty } : p
        );
      }
      return [...prev, it];
    });
  };

  const removeFromCart = (productId: string) =>
    setItems((prev) => prev.filter((p) => p.productId !== productId));

  const updateQty = (productId: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.productId === productId ? { ...p, qty } : p)));

  const clear = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
