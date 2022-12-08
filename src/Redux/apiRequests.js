import { addProduct, updateProduct, deleteProduct } from "./slice/productSlice";
import { userLogin, loginFailed } from "./slice/userSlice";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "./slice/categorySlice";
import { loading, unLoadding } from "./slice/loading";
import axios from "axios";
export const addproduct = async (product, dispatch) => {
  try {
    const res = await axios.post("/api/products", product);
    dispatch(addProduct(res.data));
  } catch (err) {
    dispatch(unLoadding());

    throw new Error("Invalid Product Data");
  }
};
export const updateproduct = async (product, dispatch) => {
  try {
    console.log(product);
    const res = await axios.put("/api/products/" + product._id, product);
    dispatch(updateProduct(res.data));
  } catch (err) {
    dispatch(unLoadding());

    throw new Error("Invalid Product Data");
  }
};
export const deleteproduct = async (product, dispatch) => {
  try {
    const res = await axios.delete("/api/products/" + product._id);
    dispatch(deleteProduct(res.data));
  } catch (err) {
    dispatch(unLoadding());

    throw new Error("Invalid Product Data");
  }
};
export const loginUser = async (users, dispatch) => {
  try {
    const res = await axios.post("/api/users/login", users);
    if (res.data.isVerify === true) {
      dispatch(userLogin(res.data));
      return res.data;
    } else return "Tài khoản chưa được xác minh, vui lòng check mail";
  } catch (err) {
    dispatch(unLoadding());

    return err.response.data.message;
  }
};
export const registerUser = async (users, dispatch) => {
  try {
    const res = await axios.post("/api/users/register", users);
    return res.data;
  } catch (err) {
    console.log(err.response.data.message);
    return err.response.data.message;
  }
};
export const addcategory = async (category, dispatch) => {
  try {
    const res = await axios.post("/api/category", category);
    dispatch(addCategory(res.data));
  } catch (err) {
    dispatch(unLoadding());
    throw new Error("Invalid Category Data");
  }
};
export const deletecategory = async (category, dispatch) => {
  try {
    const res = await axios.delete("/api/category/" + category._id);
    dispatch(deleteCategory(res.data));
  } catch (err) {
    dispatch(unLoadding());
    throw new Error("Invalid category Data");
  }
};
export const updatecategory = async (category, dispatch) => {
  try {
    const res = await axios.put("/api/category/" + category._id, category);
    dispatch(updateCategory(res.data));
  } catch (err) {
    dispatch(unLoadding());
    throw new Error("Invalid Product Data");
  }
};
export const deleteImage = async (public_id) => {
  try {
    console.log(public_id);
    const file = await axios.post("/api/uploads/destroy", {
      publicId: public_id,
    });
  } catch (err) {
    console.error(err);
  }
};
