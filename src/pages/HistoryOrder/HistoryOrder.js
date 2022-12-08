import MainLayout from "../../layouts/MainLayout/MainLayout";
import "./HistoryOrder.css";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function HistoryOrder() {
  const user = useSelector((state) => state.userInfo.info);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState([]);
  const [isLoad, setLoaded] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 6;
  const currentItems = filter.slice(itemOffset, endOffset);
  console.log(currentItems);
  const pageCount = Math.ceil(filter.length / 6);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % filter.length;
    setItemOffset(newOffset);
  };
  const getOrdersByUser = async () => {
    const orders = await axios.get("/api/order/user", { userId: user.ID });
    setOrders(orders.data);
    setFilter(orders.data);
  };
  useEffect(() => {
    getOrdersByUser();
  }, [isLoad]);
  return (
    <MainLayout>
      <div className="historyOrder">
        <div className="container">
          <span className="title">Lịch sử mua hàng</span>
          <div className="tab d-flex mb-3">
            <button
              className="btn"
              onClick={() => {
                getOrdersByUser();
              }}
            >
              Tất cả
            </button>
            <button
              className="btn mx-3"
              onClick={() => {
                setFilter(
                  orders.filter((elem, index) => {
                    return elem.isPaid === true;
                  })
                );
              }}
            >
              Đã thanh toán
            </button>
          </div>
          <ul className="list">
            {currentItems.map((elem, index) => {
              return (
                <li className="item">
                  <div className="titleOrder d-flex justify-content-between mb-2">
                    <div className="userInfo d-flex flex-column">
                      <div className="id">
                        Mã hóa đơn: <span>{elem._id}</span>
                      </div>
                      <div className="nameBuyer">
                        Tên người mua: <span>{elem.name} </span>
                      </div>
                      <div className="address">
                        Địa chỉ:
                        <span>
                          {elem.address.addressDetail}, {elem.address.ward},{" "}
                          {elem.address.district}, {elem.address.city}
                        </span>
                      </div>
                    </div>
                    <div className="statusWrap d-flex flex-column justify-content-between">
                      <div className="status">
                        {elem.isVerify ? (
                          <span className="verify"> Đã xác nhận</span>
                        ) : (
                          <span className="verify"> Chưa xác nhận</span>
                        )}
                        <span className="mx-1">/</span>
                        {elem.isPaid ? (
                          <span className="paid"> Đã thanh toán</span>
                        ) : (
                          <span className="verify"> Chưa thanh toán</span>
                        )}
                      </div>
                      <div className="controls">
                        {elem.isPaid ? null : elem.isCancel ? (
                          <div className="btn w-100">Đã hủy</div>
                        ) : (
                          <button
                            className="btn btn-primary w-100 "
                            onClick={async (e) => {
                              const promise = elem.orderItems.map(
                                async (elem, index) => {
                                  await axios.put(
                                    `/api/products/updateqtt/${elem.id}`,
                                    {
                                      sizeId: elem.sizeId,
                                      count: -Number(elem.count),
                                    }
                                  );
                                }
                              );
                              await Promise.all(promise);
                              await axios.put(`/api/order/cancel/${elem._id}`);
                              setLoaded(!isLoad);
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <ul className="listProduct">
                    {elem.orderItems.map((item, index) => {
                      return (
                        <li className="product d-flex justify-content-between align-items-center">
                          <div className="info d-flex">
                            <div className="img-wrap">
                              <img src={item.img} alt="" />
                            </div>
                            <div className="nameWrap d-flex flex-column justify-content-between">
                              <span className="name d-block">{item.name}</span>
                              <span className="size">
                                Size: {item.sizeId} x {item.count}{" "}
                              </span>
                            </div>
                          </div>
                          <span className="price">
                            {Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}

                            {/* {Intl.NumberFormat("vi-VN", {
                             style: "currency",
                             currency: "VND",
                           }).format(
                             item.size.filter((size) => {
                               return size.sizeId === elem.size;
                             })[0].price * elem.count
                           )} */}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
          <ReactPaginate
            className="pagination"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default HistoryOrder;
