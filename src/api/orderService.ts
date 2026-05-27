import axiosInstance from "./axios";

// ================= ADMIN =================

export const getAllOrders = async () => {
  const res = await axiosInstance.get("/order/all");

  return {
    orders: res.data.orders || [],
  };
};

export const placeOrder = async (data: any) => {
  // Ensure 'data' object has customerName and customerPhone
  const res = await axiosInstance.post("/order/place", data); 
  return res.data;
};

// Sirf status update karne ke liye (Accept/Reject)
export const updateOrderStatus = async (id: string, status: string) => {
  const res = await axiosInstance.put(`/order/status/${id}`, { status });
  return res.data;
};

// Details edit karne ke liye (Items/Amount)
export const editOrderDetails = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/order/edit/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id: string) => {
  const res = await axiosInstance.delete(`/order/delete/${id}`);
  return res.data;
};