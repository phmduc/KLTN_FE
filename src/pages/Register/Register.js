import "./Register.css";
import { useState } from "react";
import { registerUser } from "../../Redux/apiRequests";
import { validation } from "../../js/validation";
import { toast } from "react-toastify";
import axios from "axios";

import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordSame, setPasswordSame] = useState();
  const [emailMessage, setEmailMessage] = useState();
  const [nameMessage, setNameMessage] = useState();
  const [passwordMessage, setPasswordMessage] = useState();
  const [rePasswordMessage, setRePasswordMessage] = useState();

  const submitRegister = async () => {
    if (validation.validateName(name) !== true) {
      setNameMessage(validation.validateName(name));
    }
    if (validation.validateEmail(email) !== true) {
      setEmailMessage(validation.validateEmail(email));
    }
    if (validation.validatePass(password) !== true) {
      setPasswordMessage(validation.validatePass(password));
    }
    if (validation.validateRePass(passwordSame) !== true) {
      setRePasswordMessage(validation.validateRePass(passwordSame));
    }
    if (
      validation.validateName(name) === true &&
      validation.validateEmail(email) === true &&
      validation.validatePass(password) === true &&
      validation.validateRePass(password, passwordSame) === true
    ) {
      const newUser = {
        name: name,
        email: email.toLowerCase(),
        password: password,
      };
      const result = await registerUser(newUser);
      if (typeof result === "string") {
        setEmailMessage(result);
      } else {
        const web = `http://${window.location.host}/verify/${result._id}`;
        await axios.post("/api/email/send", {
          email: result.email,
          subject: "Xác thực tài khoản",
          content: `<span>Nhấn vào đường link sau để xác thực tài khoản của bạn </span> <a href="${web}">Click Here</a>`,
        });
        toast.success("Đăng ký thành công!!, Vui lòng check mail xác thực", {
          position: toast.POSITION.TOP_CENTER,
        });
        navigate("/login");
      }
    }
  };
  return (
    <div>
      <section className="register">
        <div className="container">
          <form>
            <h1>Đăng ký thành viên</h1>
            <div className="form-group">
              <p>Tên của bạn</p>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setNameMessage();
                  setName(e.target.value);
                }}
                className="form-control"
              />
              {nameMessage ? (
                <span className="message mt-3">{nameMessage}</span>
              ) : null}
            </div>
            <div className="form-group">
              <p>Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmailMessage();

                  setEmail(e.target.value);
                }}
                className="form-control"
                aria-describedby="emailHelp"
              />
              {emailMessage ? (
                <span className="message mt-3">{emailMessage}</span>
              ) : (
                ""
              )}
            </div>
            <div className="form-group">
              <p>Mật khẩu</p>
              <input
                value={password}
                onChange={(e) => {
                  setPasswordMessage();
                  setPassword(e.target.value);
                }}
                type="password"
                className="form-control"
              />
              {passwordMessage ? (
                <span className="message mt-3">{passwordMessage}</span>
              ) : null}
            </div>
            <div className="form-group">
              <p>Xác nhận mật khẩu</p>
              <input
                type="password"
                value={passwordSame}
                onChange={(e) => {
                  setRePasswordMessage();
                  setPasswordSame(e.target.value);
                }}
                className="form-control"
              />
            </div>
            <button
              onClick={() => {
                submitRegister();
              }}
              type="button"
              className="btn btn-dark"
            >
              Đăng ký
            </button>
            <a href="/login" className="btn  mt-3">
              Đăng Nhập
            </a>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
