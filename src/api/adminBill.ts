import axiosInstance from "./axios";

// =============================
// CREATE BILL
// =============================
export const createBill = async (data: any) => {
  const res = await axiosInstance.post("/bill/create", data);
  return res.data;
};

// =============================
// GET ALL BILLS
// =============================
export const getAllBills = async () => {
  const res = await axiosInstance.get("/bill/all");
  return res.data;
};

// =============================
// GET BILL BY ID
// =============================
export const getBillById = async (id: string) => {
  const res = await axiosInstance.get(`/bill/getById/${id}`);
  return res.data;
};

// =============================
// UPDATE BILL
// =============================
export const updateBill = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/bill/update/${id}`, data);
  return res.data;
};

// =============================
// DELETE BILL
// =============================
export const deleteBill = async (id: string) => {
  const res = await axiosInstance.delete(`/bill/delete/${id}`);
  return res.data;
};

// =============================
// EXPORT BILL EXCEL (BASE64)
// =============================
export const exportBillExcel = async () => {
  const res = await axiosInstance.get("/bill/export");
  return res.data;
};