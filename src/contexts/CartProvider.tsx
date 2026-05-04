// src/contexts/CartProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

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
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Load from localStorage (safe)
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("sl_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem("sl_cart", JSON.stringify(items));
  }, [items]);

  // ✅ Add to cart (merge qty)
  const addToCart = (item: CartItem) => {
    if (item.qty <= 0) return;

    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);

      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, qty: p.qty + item.qty }
            : p
        );
      }

      return [...prev, item];
    });
  };

  // ✅ Remove item
  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  // ✅ Update quantity (with validation)
  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, qty } : p
      )
    );
  };

  // ✅ Clear cart
  const clear = () => setItems([]);

  // ✅ Derived values (optimized)
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clear,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};