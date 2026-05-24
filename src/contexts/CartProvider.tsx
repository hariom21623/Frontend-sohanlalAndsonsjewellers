import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  sku?: string;
  maxStock: number; 
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => { success: boolean; maxStock?: number };
  clear: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
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

  const addToCart = (item: CartItem) => {
    // 🚀 FIXED: Absolute stock tracking without hardcoding default 1 rules
    const targetMaxStock = item.maxStock !== undefined && item.maxStock !== null ? Number(item.maxStock) : 1;
    const safeQty = item.qty <= 0 ? 1 : item.qty;

    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);

      if (existing) {
        const newQty = existing.qty + safeQty;
        // Cap strictly at whatever max stock is passed from the DB
        const cappedQty = newQty > targetMaxStock ? targetMaxStock : newQty;

        return prev.map((p) =>
          p.productId === item.productId 
            ? { ...p, qty: cappedQty, maxStock: targetMaxStock } 
            : p
        );
      }

      return [...prev, { ...item, qty: safeQty > targetMaxStock ? targetMaxStock : safeQty, maxStock: targetMaxStock }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const targetItem = items.find((p) => p.productId === productId);
    const currentMax = targetItem && targetItem.maxStock !== undefined ? Number(targetItem.maxStock) : 1;

    if (qty > currentMax) {
      // 🚨 Block incrementing over the custom live stock limits
      return { success: false, maxStock: currentMax };
    }

    setItems((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, qty, maxStock: currentMax } : p))
    );
    return { success: true };
  };

  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clear, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};