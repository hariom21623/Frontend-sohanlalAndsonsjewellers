// frontend/src/api/cart.ts
import axiosInstance from "./axios";

// create bill from cart (Buy Now / checkout)
export const createBillFromCart = async (payload: any) => {
  // payload should be { customerName, customerPhone, items: [{name, price, qty, sku}], discount?, gstPercent? }
  const res = await axiosInstance.post("/bill/create", payload);
  return res.data;
};
