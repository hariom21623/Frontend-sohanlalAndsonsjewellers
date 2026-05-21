import axiosInstance from "./axios";

// ================= PUBLIC =================

// Added optional signal into the filters type definition block
export const getAllPublic = async (filters: { q: string; category: string; signal?: AbortSignal }) => {
  const res = await axiosInstance.get("/product/public/getAllProduct", {
    params: {
      q: filters.q,
      category: filters.category,
    },
    // 🔥 Passes the network abort switch straight into your Axios lifecycle instance config
    signal: filters.signal, 
  });

  return {
    products: res.data.products || [],
    banners: res.data.banners || [],
    featured: res.data.featured || null,
  };
};

export const getByIdPublic = async (id: string) => {
  const res = await axiosInstance.get(`/product/public/getById/${id}`);
  return res.data;
};

// ================= ADMIN =================

export const getAllProducts = async () => {
  const res = await axiosInstance.get("/product/getAllProduct");

  return {
    products: res.data.products || [],
  };
};

export const getProductById = async (id: string) => {
  const res = await axiosInstance.get(`/product/getById/${id}`);
  return res.data;
};

export const createProduct = async (data: any) => {
  const res = await axiosInstance.post("/product/addProduct", data);
  return res.data;
};

export const updateProduct = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/product/updateById/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axiosInstance.delete(`/product/delete/${id}`);
  return res.data;
};