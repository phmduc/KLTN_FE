import Admin from "../../layouts/Admin/Admin";
import "./OrderAdmin.css";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
function OrderAdmin() {
  const [isLoad, setLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + 6;
  const currentItems = filter.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filter.length / 6);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % filter.length;
    setItemOffset(newOffset);
  };
  useEffect(() => {
    getOrder();
  }, [isLoad]);
  async function getOrder() {
    try {
      const response = await axios.get("/api/order");
      setOrders(response.data);
      setFilter(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleDelete = async (index) => {
    try {
      const res = await axios.delete("/api/order/" + orders[index]._id);
    } catch (err) {
      throw new Error("Invalid Order Data");
    }
    setLoaded(!isLoad);
    toast.success(`Xóa thành công`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  return (
    <Admin>
      <div className="OrderManage">
        <div className="container">
          <div className="tab d-flex mb-3">
            <button
              className="btn"
              onClick={() => {
                getOrder();
              }}
            >
              Tất cả
            </button>
            <button
              className="btn"
              onClick={() => {
                setFilter(
                  orders.filter((elem, index) => {
                    return elem.isCancel === true;
                  })
                );
              }}
            >
              Đã hủy
            </button>
            <button
              className="btn"
              onClick={() => {
                setFilter(
                  orders.filter((elem, index) => {
                    return elem.isVerify === false;
                  })
                );
              }}
            >
              Chờ xác nhận
            </button>
            <button
              className="btn"
              onClick={() => {
                setFilter(
                  orders.filter((elem, index) => {
                    return elem.isVerify === true && elem.isPaid === false;
                  })
                );
              }}
            >
              Đã xác nhận
            </button>
            <button
              className="btn"
              onClick={() => {
                setFilter(
                  orders.filter((elem, index) => {
                    return elem.isPaid === false;
                  })
                );
              }}
            >
              Chưa thanh toán
            </button>
            <button
              className="btn"
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
          <div className="row">
            <div className="col-12">
              <div class="content table-responsive table-full-width">
                <table class="table table-hover table-striped">
                  <thead>
                    <th>Mã đơn</th>
                    <th>Thông tin đơn hàng</th>
                    <th>Sản phẩm</th>
                    <th>Giá trị</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </thead>
                  <tbody>
                    {currentItems.map((elem, index) => {
                      return (
                        <tr>
                          <td>{elem._id}</td>
                          <td className="address">
                            <div className="info">
                              <span className="d-block">
                                Tên người nhận: {elem.name}
                              </span>
                              <span className="d-block ">
                                Địa chỉ: {elem.address.addressDetail},
                                {elem.address.ward}, {elem.address.district},
                                {elem.address.city}
                              </span>
                            </div>
                          </td>
                          <td>
                            {elem.orderItems.map((item, index) => {
                              return (
                                <div className="item">
                                  <span className="d-block">{item.name}</span>
                                  <div className="price d-flex justify-content-between">
                                    <span>Size: {item.sizeId}</span>
                                    <span>Số lượng {item.count}</span>
                                    <span>Giá: {item.price}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </td>
                          <td>{elem.totalPrice}</td>
                          <td>
                            {elem.isPaid ? (
                              <span className="d-block">Đã thanh toán</span>
                            ) : (
                              <span className="d-block">Chưa thanh toán</span>
                            )}
                          </td>
                          <td className="controls">
                            {elem.isCancel ? null : elem.isVerify ? (
                              <div className="btn btn-primary w-100 mb-3">
                                Đã xác nhận
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={async (e) => {
                                  await axios.put(`/api/order/${elem._id}`);
                                  setLoaded(!isLoad);
                                }}
                              >
                                Xác nhận
                              </button>
                            )}
                            {elem.isCancel ? (
                              <div className="btn btn-primary w-100 mb-3">
                                Đã hủy
                              </div>
                            ) : (
                              <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={async (e) => {
                                  await axios.put(
                                    `/api/order/cancel/${elem._id}`
                                  );
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
                                  setLoaded(!isLoad);
                                }}
                              >
                                Hủy
                              </button>
                            )}

                            <button
                              className="btn btn-primary w-100"
                              onClick={(e) => {
                                handleDelete(index);
                              }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
          </div>
        </div>
      </div>
    </Admin>
  );
}

export default OrderAdmin;
