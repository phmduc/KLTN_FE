import "./Verify.css";
import axios from "axios";
function Verify() {
  const id = window.location.href.split("/")[4];
  const verify = async () => {
    const res = await axios.put(`/api/users/verify/${id}`);
  };
  verify();
  return (
    <div className="verify text-center d-flex flex-column justify-content-center align-items-center">
      <i class="bi bi-check-circle"></i>
      <span>
        Tài Khoản Của Bạn Đã Được Xác Minh, Vui lòng{" "}
        <a href="/login">Đăng Nhập</a>
      </span>
    </div>
  );
}

export default Verify;
