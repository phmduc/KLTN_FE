import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import ProductDetail from "./pages/productDetail/productDetail.js";
import Admin from "./layouts/Admin/Admin.js";
import RePass from "./pages/RePass/RePass.js";
import Products from "./pages/Products/Products.js";
import Cart from "./pages/Cart/Cart.js";
import ProductAdmin from "./pages/ProductAdmin/ProductAdmin.js";
import CategoryAdmin from "./pages/CategoryAdmin/CategoryAdmin.js";
import OrderAdmin from "./pages/OrderAdmin/OrderAdmin.js";
import Register from "./pages/Register/Register.js";
import UserAdmin from "./pages/UserAdmin/UserAdmin.js";
import Checkout from "./pages/Checkout/Checkout.js";
import ForgetPass from "./pages/ForgetPass/ForgetPass.js";
import Verify from "./pages/Verify/Verify.js";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.js";
import axios from "axios";
import React from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Loading from "./components/Loading/Loading.js";
import { useSelector } from "react-redux";
import { getAllCategory } from "./Redux/slice/categorySlice.js";
import { useEffect } from "react";
import HistoryOrder from "./pages/HistoryOrder/HistoryOrder.js";
import ThanksPage from "./pages/ThanksPage/index.js";

function App() {
  const user = useSelector((state) => state.userInfo.info);
  console.log(user);
  const dispatch = useDispatch();
  const [catagory, setCategory] = useState();
  async function getCategory() {
    try {
      const response = await axios.get("/api/category");
      dispatch(getAllCategory(response.data));
      setCategory(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getCategory();
  }, []);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/">
          <Route index element={<Home {...user} />} />
          {!user.ID ? (
            <React.Fragment>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Route path="/login" element={<Home />} />
              <Route path="/register" element={<Home />} />
              <Route path="/cart/checkout" element={<Checkout />} />
              <Route path="/history" element={<HistoryOrder />} />
            </React.Fragment>
          )}
          <Route path="/products/">
            <Route index element={<Products />} />
            <Route path=":id" element={<ProductDetail />} />
          </Route>
          {user.isAdmin === true ? (
            <Route path="/admin/">
              <Route path="products" element={<ProductAdmin />} />
              <Route path="category" element={<CategoryAdmin />} />
              <Route path="user" element={<UserAdmin />} />
              <Route path="order" element={<OrderAdmin />} />
            </Route>
          ) : (
            <Route path="/admin" element={<Home />} />
          )}

          <Route path="/cart" element={<Cart />} />
          <Route path="/forget" element={<ForgetPass />} />
          <Route path="/repass" element={<RePass />} />
          <Route path="/thankyou" element={<ThanksPage />} />
          <Route path="/verify/:id" element={<Verify />}></Route>
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
