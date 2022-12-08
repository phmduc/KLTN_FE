import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { validation } from "../../js/validation";

function RePass() {
  const [oldPass, setOldPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPass, setReNewPass] = useState("");
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
    <div className="RePass">
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

export default RePass;
