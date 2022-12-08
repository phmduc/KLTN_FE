import MainLayout from '../../layouts/MainLayout/MainLayout';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../Redux/slice/cartSlice';

import './Cart.css';
function Cart() {
  const user = useSelector((state) => state.userInfo.info);
  const listCart = useSelector((state) => state.cart.listCart);
  const listProduct = useSelector((state) => state.product.productsList);
  const dispatch = useDispatch();

  const handleDelete = (ID, sizeId) => {
    const removeItem = { ID: ID, size: sizeId };
    dispatch(removeFromCart(removeItem));
  };
  return (
    <MainLayout>
      <section className='cart'>
        <div className='container'>
          <div className='row justify-content-between'>
            <div className='col-lg-9 col-12'>
              <div className='list'>
                <span className='title'>Giỏ hàng của bạn</span>
                <ul>
                  {listCart.map((elem, index) => {
                    return listProduct.map((item, index) => {
                      if (item._id === elem.ID) {
                        return (
                          <li className='item d-flex'>
                            <div className='img-wrap'>
                              <img src={item.image[0].url} alt='' />
                            </div>
                            <div className='info'>
                              <span className='name d-block'>{item.name}</span>
                              <span className='size'>Size: {elem.size}</span>
                              <div class='count d-flex align-items-center mb-3'>
                                <div class='number'>
                                  <button
                                    onClick={() => {
                                      const itemUpdate = {
                                        ID: elem.ID,
                                        size: elem.size,
                                        count: -1,
                                      };
                                      dispatch(addToCart(itemUpdate));
                                    }}
                                    class='minus'>
                                    -
                                  </button>
                                  <input
                                    onChange={() => {}}
                                    value={elem.count}
                                  />
                                  <button
                                    onClick={() => {
                                      const itemUpdate = {
                                        ID: elem.ID,
                                        size: elem.size,
                                        count: 1,
                                      };
                                      dispatch(addToCart(itemUpdate));
                                    }}
                                    class='plus'>
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className='controls d-flex flex-column justify-content-between'>
                              <span className='price'>
                                {Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(
                                  item.size.filter((size) => {
                                    return size.sizeId === elem.size;
                                  })[0].price * elem.count
                                )}
                              </span>
                              <button
                                type='button'
                                onClick={() => {
                                  handleDelete(elem.ID, elem.size);
                                }}>
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      }
                    });
                  })}
                </ul>
              </div>
            </div>
            <div className='col-lg-3 col-12'>
              <div className='receipt'>
                <span className='title'>Đơn hàng của bạn</span>
                <div className='priceTotal'>
                  <ul>
                    <li className='d-flex justify-content-between mb-3'>
                      Số lượng:
                      <span>
                        {listCart.reduce((previousValue, currentValue) => {
                          return previousValue + currentValue.count;
                        }, 0)}
                      </span>
                    </li>
                    <li className='d-flex justify-content-between'>
                      Tổng tiền:
                      <span>
                        {Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(
                          listCart.reduce((previousValue, currentValue) => {
                            let price = 0;
                            listProduct.forEach((elem, index) => {
                              if (elem._id === currentValue.ID) {
                                price = elem.size.find((size, index) => {
                                  return size.sizeId === currentValue.size;
                                }).price;
                              }
                            });
                            return previousValue + currentValue.count * price;
                          }, 0)
                        )}
                      </span>
                    </li>
                  </ul>
                  {user.ID ? (
                    <a href='/cart/checkout' className='btn my-3 w-100'>
                      Check out
                    </a>
                  ) : (
                    <a href='/login' className='btn my-3 w-100'>
                      Vui lòng đăng nhập để tiếp tục
                    </a>
                  )}
                </div>
                <div className='policy'>
                  <ul>
                    <li>Bảo mật thanh toán</li>
                    <li>Miễn phí giao hàng trong nội thành</li>
                    <li>Giao hàng nhanh chóng</li>
                    <li>Hoàn trả trong vòng 30 ngày</li>
                  </ul>
                </div>
                <div className='contact'>
                  <ul>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Cart;
