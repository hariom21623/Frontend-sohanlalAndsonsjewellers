import axiosInstance from "./axios";

export const createProduct = (data: any) =>
  axiosInstance.post("/product/addProduct", data).then((r) => r.data);


export const getAllProducts = (params?: Record<string, any>) =>
  axiosInstance
    .get("/product/getAllProduct", { params })
    .then((r) => {
      return {
        products: r.data.products || [],
      };
    });


export const getProductById = (id: string) =>
  axiosInstance.get(`/product/getById/${id}`).then((r) => r.data);

export const updateProduct = (id: string, data: any) =>
  axiosInstance.put(`/product/updateById/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  axiosInstance.delete(`/product/delete/${id}`).then((r) => r.data);

//User List Api
export  const getAllPublic = (params?: Record<string, any>) =>
  axiosInstance
    .get("/product/public/getAllProduct", { params })
    .then((r) => {
      return {
        products: r.data.products || [],
      };
    });


export const getByIdPublic = (id: string) =>
  axiosInstance.get(`/product/public/getById/${id}`).then((r) => r.data);
