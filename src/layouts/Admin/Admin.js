import './Admin.css';

import {
  getAllUser,
  updateUser,
  userLogout,
} from '../../Redux/slice/userSlice.js';
import $ from 'jquery';
import $$ from 'jquery';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading.js';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { validation } from '../../js/validation';
function Admin({ children, props }) {
  const user = useSelector((state) => state.userInfo.info);
  const [show, setShow] = useState(false);
  const [newName, setNewName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPass, setReNewPass] = useState('');

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(userLogout());
    navigate('/login');
  };
  useEffect(() => {
    $('#main-nav li a').each((index, elem) => {
      if ($(elem).hasclassName('active')) {
        $(elem).parent().addclassName('active');
      }
    });
  }, []);

  const changePass = async () => {
    if (validation.validatePass(newPassword)) {
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
    }
  };

  const loadingStatus = useSelector((state) => state.loading.value);
  return (
    <div className='wrapperAdmin'>
      <div className='sidebar'>
        <div className='sidebar-wrapper'>
          <div className='logo text-center'>
            <a href='/' className='simple-text'>
              Rekeans
            </a>
          </div>
          <ul className='nav'>
            <li className='nav-item w-100 mb-3 '>
              <NavLink
                activeclassName='active'
                to='/admin/dashboard'
                className='d-flex align-items-center nav-link'>
                <i className='bi bi-speedometer'></i>
                Dashboard
              </NavLink>
            </li>
            <li className='nav-item w-100 mb-3'>
              <NavLink
                activeclassName='active'
                to='/admin/products'
                className='d-flex align-items-center nav-link'>
                <i className='bi bi-archive'></i>
                Product
              </NavLink>
            </li>
            <li className='nav-item w-100 mb-3'>
              <NavLink
                activeclassName='active'
                to='/admin/category'
                className='d-flex align-items-center nav-link'>
                <i className='bi bi-tag'></i>
                Category
              </NavLink>
            </li>
            <li className='nav-item w-100 mb-3'>
              <NavLink
                to='/admin/user'
                activeclassName='active'
                className='d-flex align-items-center nav-link'>
                <i className='bi bi-person-circle'></i>
                User
              </NavLink>
            </li>
            <li className='nav-item w-100 '>
              <NavLink
                to='/admin/order'
                activeclassName='active'
                className='d-flex align-items-center nav-link'>
                <i class='bi bi-bag-check'></i>
                Order
              </NavLink>
            </li>
          </ul>
        </div>
        <div className='sidebar-background'></div>
      </div>

      <div className='view'>
        <nav class='navbar navbar-expand-lg ' color-on-scroll='500'>
          <div class='container-fluid'>
            <div class='navbar-brand' href='#pablo'>
              Welcome, admin
              <img src='https://www.macmillandictionary.com/external/slideshow/full/emoji_party_popper_full.jpg'></img>
            </div>
            <div className='account'>
              <p>Xin chào, {user.name}</p>
              <ul className='dropdown__account'>
                <li>
                  <button>
                    <Link to='/history'>Đơn mua</Link>
                  </button>
                </li>
                <li>
                  <button
                    variant='primary'
                    className='info'
                    onClick={() => {
                      handleShow();
                    }}>
                    Thông tin cá nhân
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}>
                    Đăng xuất
                  </button>
                </li>
                <Modal
                  className='infoModal'
                  size='md'
                  show={show}
                  onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Thông tin cá nhân</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='infoDetail'>
                      <div className='name mb-3 d-flex align-items-center'>
                        <span className='d-block'>Tên: {user.name} </span>
                        <input
                          type='text'
                          className={isActive ? 'show' : ''}
                          placeholder='Nhập tên mới...'
                          onChange={(e) => {
                            setNewName(e.target.value);
                          }}
                        />
                        <button
                          className={isActive ? 'show save' : 'save'}
                          onClick={async (e) => {
                            if (newName) {
                              const res = await axios.put(
                                '/api/users/' + user.ID,
                                {
                                  name: newName,
                                  isAdmin: user.isAdmin,
                                  isVerify: user.isVerify,
                                }
                              );
                              dispatch(updateUser(res.data));
                              setNewName();

                              setIsActive(false);
                              toast.success(`Đổi tên thành công`, {
                                position: toast.POSITION.TOP_CENTER,
                              });
                            } else {
                              setIsActive(false);
                            }
                          }}>
                          Lưu
                        </button>
                        <button
                          className={isActive ? 'show edit' : 'edit'}
                          onClick={(e) => {
                            setIsActive(true);
                          }}>
                          <i class='bi bi-pencil-square'></i>
                        </button>
                      </div>
                      <span className='d-block mb-3'>Email: {user.email}</span>
                      <span className='d-block mb-3'>
                        {user.isAdmin ? 'Quyền hạn: Admin' : 'Quyền hạn: User'}
                      </span>
                      <span className='d-block mb-3'>
                        {user.isVerify
                          ? 'Trạng thái: Đã xác minh'
                          : 'Trạng thái: Chưa xác minh'}
                      </span>
                      <form>
                        <div className='form-group  mb-3'>
                          <label>Mật khẩu cũ</label>
                          <input
                            type='password'
                            className='form-control'
                            id='oldPass'
                            value={oldPass}
                            onChange={(e) => {
                              setOldPass(e.target.value);
                            }}
                          />
                        </div>
                        <div className='form-group  mb-3'>
                          <label>Mật khẩu mới</label>
                          <input
                            type='password'
                            className='form-control '
                            id='newPass'
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                          />
                        </div>
                        <div className='form-group mb-3'>
                          <label>Nhập mật khẩu mới</label>
                          <input
                            type='password'
                            className='form-control'
                            id='reNewPass'
                            value={reNewPass}
                            onChange={(e) => {
                              setReNewPass(e.target.value);
                            }}
                          />
                        </div>
                        <button
                          type='submit'
                          onClick={(e) => {
                            e.preventDefault();
                            changePass();
                          }}
                          className='btn btn-primary'>
                          Đổi mật khẩu
                        </button>
                      </form>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </ul>
            </div>
          </div>
        </nav>
        {loadingStatus === 0 ? <Loading></Loading> : children}
      </div>
    </div>
  );
}

export default Admin;
