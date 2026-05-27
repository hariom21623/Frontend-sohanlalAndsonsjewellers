import axiosInstance from "./axios";

// CREATE USER
export const createUser = async (data: any) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

//getUser Profile
export const getMyProfile = async () => {
  const res = await axiosInstance.get("/user/profile"); // Backend ka naya route
  return res.data;
};

// GET ALL USERS
export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user/getUsers");
  return res.data;
};

// GET USER BY ID
export const getUserById = async (id: string) => {
  const res = await axiosInstance.get(`/user/getUsers/${id}`);
  return res.data;
};

// UPDATE USER
export const updateUser = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/user/updateUser/${id}`, data);
  return res.data;
};

// DELETE USER
export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`/user/deleteUser/${id}`);
  return res.data;
};
