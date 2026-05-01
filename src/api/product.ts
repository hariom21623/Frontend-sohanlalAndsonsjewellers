import axiosInstance from "./axios";

// CREATE
export const createProduct = async (data: any) => {
  const res = await axiosInstance.post("/product/addProduct", data);
  return res.data;
};

// ADMIN LIST
export const getAllProducts = async (params?: any) => {
  const res = await axiosInstance.get("/product/getAllProduct", { params });

  return {
    products: res.data.products || res.data || [],
  };
};

// PUBLIC LIST (FIXED)
export const getAllPublic = async (params?: any) => {
  const res = await axiosInstance.get("/product/public/getAllProduct", {
    params,
  });

  console.log("PUBLIC API RESPONSE:", res.data); // 🔥 DEBUG

  return {
    products: res.data.products || res.data || [],
  };
};

// GET BY ID
export const getProductById = async (id: string) => {
  const res = await axiosInstance.get(`/product/getById/${id}`);
  return res.data;
};

export const getByIdPublic = async (id: string) => {
  const res = await axiosInstance.get(`/product/public/getById/${id}`);
  return res.data;
};

// UPDATE
export const updateProduct = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/product/updateById/${id}`, data);
  return res.data;
};

// DELETE
export const deleteProduct = async (id: string) => {
  const res = await axiosInstance.delete(`/product/delete/${id}`);
  return res.data;
};