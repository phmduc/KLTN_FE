import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout, updateUser } from "../../Redux/slice/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { toast } from "react-toastify";
import { useState } from "react";
import { validation } from "../../js/validation";

function Header() {
  const user = useSelector((state) => state.userInfo.info);
  const listProducts = useSelector((state) => state.product.productsList);
  const [result, setResult] = useState([]);
  const [hasResult, setHasResult] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [newName, setNewName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [oldPassMessage, setOldPassMessage] = useState("");
  const [newPassMessage, setNewPassMessage] = useState("");
  const [reNewPassMessage, setReNewPassMessage] = useState("");
  const [navbar, setNavbar] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(userLogout());
    navigate("/login");
  };
  const changePass = async () => {
    if (
      validation.validatePass(newPassword) === true &&
      validation.validateRePass(newPassword, reNewPass) === true
    ) {
      console.log("giong nhau");
      const newPass = {
        email: user.email,
        password: oldPass,
        newPass: newPassword,
      };
      await axios.put(`/api/users/changepass/${user.ID}`, newPass);
      toast.success(`Đổi mật khẩu thành công`, {
        position: toast.POSITION.TOP_CENTER,
      });
      logout();
    } else {
      setNewPassMessage(validation.validatePass(newPassword));
      setReNewPassMessage(validation.validateRePass(newPassword, reNewPass));
    }
  };
  const search = async (e) => {
    if (e.target.value === "") {
      setHasResult(false);
    } else
      setResult(
        listProducts.filter((elem, index) => {
          return elem.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
      );
  };
  return (
    <header className="py-3">
      <div className="container">
        <div className="menu">
          <div className="row align-items-center">
            <div className="col-lg-3 col-4 ">
              <div className="logo">
                <a href="/">Rekeans</a>
              </div>
            </div>
            <div className="col-5 d-lg-block d-none ">
              <ul className="list p-0 m-0">
                <li className="items">
                  <a href="/">Trang chủ</a>
                </li>
                <li className="items">
                  <Link to="/products">Sản phẩm</Link>
                </li>
                <li className="items">
                  <a href="#">Blog</a>
                </li>
                <li className="items">
                  <a href="#">Giới thiệu</a>
                </li>
                <li className="items">
                  <a href="#">Liên hệ</a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-6">
              <ul className="list-control p-0 m-0">
                <li className="items-control has-input">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      aria-label="Example text with button addon"
                      aria-describedby="button-addon1"
                      onChange={(e) => {
                        setHasResult(true);
                        search(e);
                      }}
                    />
                  </div>
                  {hasResult ? (
                    <ul className="result">
                      {result.length !== 0 ? (
                        result.map((elem, index) => {
                          return (
                            <li>
                              <Link
                                to={`/products/${elem._id}`}
                                className="item d-flex"
                              >
                                <div className="img-wrap">
                                  <img src={elem.image[0].url} alt="" />
                                </div>
                                <span>{elem.name}</span>
                              </Link>
                            </li>
                          );
                        })
                      ) : (
                        <li>Không tìm thấy sản phẩm</li>
                      )}
                    </ul>
                  ) : null}
                </li>
                <li className="items-control d-lg-flex d-none align-items-center">
                  <a href="/cart">
                    <svg
                      width="33"
                      height="37"
                      viewBox="0 0 36 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_85_350)">
                        <path
                          d="M29.8587 35.375H6.14149C5.65796 35.375 5.18007 35.2711 4.74018 35.0704C4.30029 34.8697 3.90867 34.5767 3.59184 34.2115C3.27501 33.8462 3.04036 33.4171 2.90379 32.9533C2.76721 32.4894 2.7319 32.0017 2.80024 31.523L5.62511 11.75H30.3751L33.2 31.523C33.2683 32.0017 33.233 32.4894 33.0964 32.9533C32.9599 33.4171 32.7252 33.8462 32.4084 34.2115C32.0915 34.5767 31.6999 34.8697 31.26 35.0704C30.8202 35.2711 30.3423 35.375 29.8587 35.375V35.375Z"
                          stroke="#0F1419"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="square"
                        />
                        <path
                          d="M12.375 17.375V7.25C12.375 5.75816 12.9676 4.32742 14.0225 3.27252C15.0774 2.21763 16.5082 1.625 18 1.625V1.625C18.7387 1.625 19.4701 1.77049 20.1526 2.05318C20.8351 2.33586 21.4551 2.75019 21.9775 3.27252C22.4998 3.79485 22.9141 4.41495 23.1968 5.09741C23.4795 5.77986 23.625 6.51131 23.625 7.25V17.375"
                          stroke="#0F1419"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="square"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_85_350">
                          <rect
                            width="36"
                            height="36"
                            fill="white"
                            transform="translate(0 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  {!user.ID ? (
                    <a href="/login">
                      <svg
                        width="27"
                        height="37"
                        viewBox="0 0 30 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.375 23H11.625C6.03262 23 1.5 27.5326 1.5 33.125C1.5 33.125 6.5625 35.375 15 35.375C23.4375 35.375 28.5 33.125 28.5 33.125C28.5 27.5326 23.9674 23 18.375 23Z"
                          stroke="#0F1419"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="square"
                        />
                        <path
                          d="M7.125 9.5C7.125 5.15075 10.6508 1.625 15 1.625C19.3492 1.625 22.875 5.15075 22.875 9.5C22.875 13.8492 19.3492 18.5 15 18.5C10.6508 18.5 7.125 13.8492 7.125 9.5Z"
                          stroke="#0F1419"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="square"
                        />
                      </svg>
                    </a>
                  ) : (
                    <div className="account">
                      Xin chào, {user.name}
                      <ul className="dropdown-acount">
                        {user.isAdmin === true ? (
                          <li>
                            <a href="/admin/products">Quản lý</a>
                          </li>
                        ) : null}
                        <li>
                          <a href="/history">Đơn mua</a>
                        </li>
                        <li>
                          <Button
                            variant="primary"
                            className="info"
                            onClick={() => {
                              handleShow();
                            }}
                          >
                            Thông tin cá nhân
                          </Button>
                        </li>
                        <li>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              logout();
                            }}
                          >
                            Đăng xuất
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            <div className="col-2 d-lg-none d-block">
              <i
                class="navbar-btn bi bi-list"
                onClick={() => {
                  setNavbar(!navbar);
                }}
              >
                {navbar ? (
                  <div className="menu-navbar">
                    <nav
                      class="nav_mobile"
                      style={{
                        visibility: "visible",
                        animationDuration: "400ms",
                        animationName: "fadeInRight",
                      }}
                    >
                      <ul class="nav_mobile-list">
                        <div className="logo navbar-logo">
                          <a href="/">Rekeans</a>
                        </div>
                        <li>
                          <Link to="/admin">Trang chủ</Link>
                        </li>
                        <li>
                          <Link to="/products">Sản phẩm</Link>
                        </li>
                        <li>
                          <Link to="/blog">Blog</Link>
                        </li>
                        <li>
                          <Link to="/introduct">Giới thiệu</Link>
                        </li>
                        <li>
                          <Link to="/contact">Liên hệ</Link>
                        </li>
                      </ul>
                      <i class="close-btn bi bi-x"></i>
                    </nav>
                    <label for="nav_input" class="nav_overlay"></label>
                  </div>
                ) : (
                  <div />
                )}
              </i>
            </div>
          </div>
        </div>
      </div>
      <Modal className="infoModal" size="md" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin cá nhân</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="infoDetail">
            <div className="name mb-3 d-flex align-items-center">
              <span className="d-block">Tên: {user.name} </span>
              <input
                type="text"
                className={isActive ? "show" : ""}
                placeholder="Nhập tên mới..."
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
              />
              <button
                className={isActive ? "show save" : "save"}
                onClick={async (e) => {
                  if (newName) {
                    const res = await axios.put("/api/users/" + user.ID, {
                      name: newName,
                      isAdmin: user.isAdmin,
                      isVerify: user.isVerify,
                    });
                    dispatch(updateUser(res.data));
                    setNewName();

                    setIsActive(false);
                    toast.success(`Đổi tên thành công`, {
                      position: toast.POSITION.TOP_CENTER,
                    });
                  } else {
                    setIsActive(false);
                  }
                }}
              >
                Lưu
              </button>
              <button
                className={isActive ? "show edit" : "edit"}
                onClick={(e) => {
                  setIsActive(true);
                }}
              >
                <i class="bi bi-pencil-square"></i>
              </button>
            </div>
            <span className="d-block mb-3">Email: {user.email}</span>
            <span className="d-block mb-3">
              {user.isAdmin ? "Quyền hạn: Admin" : "Quyền hạn: User"}
            </span>
            <span className="d-block mb-3">
              {user.isVerify
                ? "Trạng thái: Đã xác minh"
                : "Trạng thái: Chưa xác minh"}
            </span>
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
                    setNewPassMessage("");
                  }}
                />
                {newPassMessage ? (
                  <span className="message">{newPassMessage}</span>
                ) : null}
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
                    setReNewPassMessage("");
                  }}
                />
                {reNewPassMessage ? (
                  <span className="message">{reNewPassMessage}</span>
                ) : null}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </header>
  );
}

export default Header;
