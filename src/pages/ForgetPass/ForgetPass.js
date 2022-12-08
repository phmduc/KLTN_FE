import "./ForgetPass.css";
import { validation } from "../../js/validation";
import axios from "axios";
import { toast } from "react-toastify";

import { useState } from "react";
function ForgetPass() {
  const [oldPass, setOldPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [email, setEmail] = useState();
  const [mount, setUnnmount] = useState();
  const [messageEmail, setMessageEmail] = useState();
  const checkmail = async () => {
    if (validation.validateEmail(email) === true) {
      const match = await axios.get(`/api/users/forgetpass/${email}`);
      if (typeof match === "object") {
      }
    } else {
      setMessageEmail(validation.validateEmail(email));
    }
  };
  const changePass = async () => {
    if (validation.validatePass(newPassword)) {
      const newPass = {
        password: oldPass,
        newPass: newPassword,
      };
      await axios.put(`/api/users/changeforgetpass`, newPass);
      toast.success(`Đổi mật khẩu thành công`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <div className="wrapperForget d-flex align-items-center justify-content-center flex-column">
      <div className="formForget ">
        <span className="title">Lấy lại mật khẩu</span>
        <form>
          <div className="form-group">
            <label className="mb-3">Nhập email của bạn</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                setMessageEmail();
                setEmail(e.target.value);
              }}
            />
            {messageEmail ? (
              <span className="message mt-3 d-block">{messageEmail}</span>
            ) : null}
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3 w-100"
            onClick={(e) => {
              e.preventDefault();
              checkmail();
            }}
          >
            Submit
          </button>
        </form>
      </div>
      <div className="formForget ">
        <span className="title">Lấy lại mật khẩu</span>
        <form>
          <div className="form-group  mb-3">
            <label>Mật khẩu cũ</label>
            <input
              type="password"
              className="form-control"
              id="oldPass"
              value={oldPass}
              onChange={(e) => {
                setOldPass(e.target.value);
              }}
            />
          </div>
          <div className="form-group  mb-3">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              className="form-control "
              id="newPass"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Nhập mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              id="reNewPass"
              value={reNewPass}
              onChange={(e) => {
                setReNewPass(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              changePass();
            }}
            className="btn btn-primary"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
