import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import "./Checkout.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { removeAll } from "../../Redux/slice/cartSlice";
import PayPal from "../../components/PayPal/PayPal";

function Checkout() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userInfo.info);
  const listCart = useSelector((state) => state.cart.listCart);
  const listProduct = useSelector((state) => state.product.productsList);
  const [province, setProvince] = useState([]);
  const [cityId, setCityId] = useState();
  const [districtId, setDistrictId] = useState();
  const [wardId, setWardId] = useState();
  const [payment, setPayment] = useState("");
  const [pay, setPay] = useState(false);

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [checkout, setCheckOut] = useState(false);
  const [number, setNumber] = useState();
  const [address, setAddress] = useState();
  const total = useRef();

  const dispatch = useDispatch();

  async function getProvince() {
    try {
      const response = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );
      setProvince(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  let totalValue = listCart.reduce((previousValue, currentValue) => {
    let price = 0;
    listProduct.forEach((elem, index) => {
      if (elem._id === currentValue.ID) {
        price = elem.size.find((size, index) => {
          return size.sizeId === currentValue.size;
        }).price;
      }
    });
    return previousValue + currentValue.count * price;
  }, 0);
  const submitOrder = async () => {
    if (
      firstName &&
      lastName &&
      number &&
      address &&
      cityId &&
      districtId &&
      wardId &&
      payment
    ) {
      const order = {
        user: user.ID,
        name: firstName + "" + lastName,
        orderItems: listCart.map((elem, index) => {
          return {
            id: elem.ID,
            name: listProduct.filter((item, index) => {
              return item._id === elem.ID;
            })[0].name,
            count: elem.count,
            sizeId: elem.size,
            price:
              listProduct
                .filter((item, index) => {
                  return item._id === elem.ID;
                })[0]
                .size.filter((item, index) => {
                  return item.sizeId === elem.size;
                })[0].price * elem.count,
            img: listProduct.filter((item, index) => {
              return item._id === elem.ID;
            })[0].image[0].url,
          };
        }),
        paymentMethod: payment,
        address: {
          addressDetail: address,
          city: cityId,
          district: districtId,
          ward: wardId,
        },
        totalPrice: listCart.reduce((previousValue, currentValue) => {
          let price = 0;
          listProduct.forEach((elem, index) => {
            if (elem._id === currentValue.ID) {
              price = elem.size.find((size, index) => {
                return size.sizeId === currentValue.size;
              }).price;
            }
          });
          return previousValue + currentValue.count * price;
        }, 0),
      };
      try {
        const response = await axios.post("/api/order", order);
        const promise = listCart.map(async (elem, index) => {
          await axios.put(`/api/products/updateqtt/${elem.ID}`, {
            sizeId: elem.size,
            count: Number(elem.count),
          });
        });
        await Promise.all(promise);
      } catch (error) {
        console.error(error);
      }
      dispatch(removeAll());
      navigate("/thankyou");
    } else if (
      !firstName ||
      !lastName ||
      !number ||
      !address ||
      !cityId ||
      !districtId ||
      !wardId
    ) {
      toast.error("Vui l??ng ??i???n ?????y ????? th??ng tin nh???n h??ng", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!payment) {
      toast.error("Vui l??ng ch???n ph????ng th???c thanh to??n", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  useEffect(() => {
    getProvince();
  }, []);

  return (
    <MainLayout>
      <section className="checkout">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="information">
                <span>Th??ng tin ?????t h??ng</span>
                <div className="form-group d-flex ">
                  <input
                    type="text"
                    placeholder="H???"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="T??n"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                </div>
                <div className="address-select d-flex">
                  <select
                    className="form-select form-select-sm"
                    id="city"
                    onChange={(e) => {
                      setCityId(e.target.value);
                    }}
                  >
                    <option value="" selected>
                      Ch???n t???nh th??nh
                    </option>
                    {province.map((elem, index) => {
                      return <option value={elem.Name}>{elem.Name}</option>;
                    })}
                  </select>
                  <select
                    className="form-select form-select-sm"
                    id="district"
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                    }}
                  >
                    <option value="" selected>
                      Ch???n qu???n huy???n
                    </option>
                    {province.map((elem, index) => {
                      if (elem.Name === cityId) {
                        return elem.Districts.map((district, index) => {
                          return (
                            <option value={district.Name}>
                              {district.Name}
                            </option>
                          );
                        });
                      }
                    })}
                  </select>
                  <select
                    className="form-select form-select-sm"
                    id="ward"
                    aria-label=".form-select-sm"
                    onChange={(e) => {
                      setWardId(e.target.value);
                    }}
                  >
                    <option value="" selected>
                      Ch???n ph?????ng x??
                    </option>
                    {province.map((elem, index) => {
                      if (elem.Name === cityId) {
                        return elem.Districts.map((district, index) => {
                          if (district.Name === districtId) {
                            return district.Wards.map((ward, index) => {
                              return (
                                <option value={ward.Name}>{ward.Name}</option>
                              );
                            });
                          }
                        });
                      }
                    })}
                  </select>
                </div>
                <input
                  type="text"
                  className="d-block w-100"
                  placeholder="?????a ch??? c??? th???..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
                <input
                  className="d-block w-100"
                  type="text"
                  placeholder="S??? ??i???n tho???i"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                />
              </div>
              <div className="payment mt-3">
                <span>Ph????ng th???c thanh to??n</span>
                <div className="form-check disabled mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentRadios"
                    id="paymentRadios1"
                    value="PayPal"
                    onChange={(e) => {
                      console.log(e.target.checked);
                      if (e.target.checked === true) {
                        setCheckOut(true);
                        setPayment(e.target.value);
                      }
                    }}
                  />
                  <label
                    className="form-check-label d-block"
                    htmlFor="paymentRadios1"
                  >
                    Thanh to??n qua PayPal
                  </label>
                  {/* {checkout ? <PayPal value={totalValue} /> : null} */}
                  {checkout ? (
                    <button
                      className="my-3"
                      onClick={() => {
                        if (
                          firstName &&
                          lastName &&
                          number &&
                          address &&
                          cityId &&
                          districtId &&
                          wardId &&
                          payment
                        ) {
                          setPay(true);
                        } else {
                          {
                            toast.error(
                              "Vui l??ng ??i???n ?????y ????? th??ng tin nh???n h??ng",
                              {
                                position: toast.POSITION.TOP_CENTER,
                              }
                            );
                          }
                        }
                      }}
                    >
                      Thanh to??n ngay{" "}
                    </button>
                  ) : null}
                  {pay ? (
                    <PayPal
                      value={totalValue}
                      submit={(e) => {
                        submitOrder();
                      }}
                    />
                  ) : null}
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentRadios"
                    id="paymentRadios2"
                    value="COD"
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setPayment(e.target.value);
                      }
                      setCheckOut(false);
                    }}
                  />
                  <label className="form-check-label" htmlFor="paymentRadios2">
                    Thanh to??n khi nh???n h??ng
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="receipt">
                <span className="title">????n h??ng c???a b???n</span>
                <ul>
                  {listCart.map((elem, index) => {
                    return listProduct.map((item, index) => {
                      if (item._id === elem.ID) {
                        return (
                          <li className="item d-flex">
                            <div className="img-wrap">
                              <img src={item.image[0].url} alt="" />
                            </div>
                            <div className="desc d-flex flex-column justify-content-between">
                              <div className="name">{item.name}</div>
                              <div className="size">Size: {elem.size}</div>
                            </div>
                            <div className="priceWrap d-flex flex-column justify-content-between">
                              <div className="price">
                                {Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(
                                  item.size.filter((size) => {
                                    return size.sizeId === elem.size;
                                  })[0].price * elem.count
                                )}
                              </div>
                              <div className="count ">SL x {elem.count}</div>
                            </div>
                          </li>
                        );
                      }
                    });
                  })}
                </ul>
                <div className="totalPrice d-flex justify-content-between">
                  T???ng c???ng:
                  <span ref={total}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
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
                </div>
                {payment === "COD" ? (
                  <button
                    onClick={() => {
                      submitOrder();
                    }}
                    className="btn w-100"
                  >
                    Check out
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Checkout;
