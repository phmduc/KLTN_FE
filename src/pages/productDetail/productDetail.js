import MainLayout from "../../layouts/MainLayout/MainLayout";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../Redux/slice/cartSlice";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import { toast } from "react-toastify";
import "@fancyapps/ui/dist/fancybox.css";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import $ from "jquery";
import "./productDetail.css";
import { Rate } from "antd";
import { validation } from "../../js/validation";
import moment from "moment-timezone";
import { Modal, Button } from "react-bootstrap";

function ProductDetail({ match }) {
  const listCart = useSelector((state) => state.cart.listCart);
  const user = useSelector((state) => state.userInfo.info);
  const dispatch = useDispatch();
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [count, setCount] = useState(1);
  const [isLoad, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const path = useLocation().pathname.split("/");
  const ID = path[path.length - 1];
  const [star, setStar] = useState();
  async function getProductDetail() {
    try {
      const response = await axios.get(`/api/products/${ID}`);
      setItem(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  }
  useEffect(() => {
    getProductDetail();
  }, [ID]);
  useEffect(() => {
    getProductDetail();
  }, [isLoad]);
  console.log(listCart);
  const handleAddCart = () => {
    const size = $(".size .nav-link.active").html();
    let countInStock;
    let countInCart;

    item.size.map((item) => {
      if (size === item.sizeId) {
        countInStock = item.count;
      }
    });
    listCart.map((item) => {
      if (size === item.size && item.ID === ID) {
        countInCart = item.count;
      }
    });
    console.log(countInCart);
    if (Number(countInCart) + Number(count) > Number(countInStock)) {
      toast.error(`Số lượng trong giỏ hiện vượt quá kho`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (count === 0) {
      toast.error(`Vui lòng nhập số lượng`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (count <= countInStock) {
      const itemAdd = {
        ID: item._id,
        size: size,
        count: count,
      };
      dispatch(addToCart(itemAdd));
      toast.success(`Thêm thành công`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error(
        `Vượt quá số lượng trong kho, Hiện tại còn ${countInStock} Sản phẩm`,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    }
  };
  const addComment = async () => {
    if (validation.validateName(comment) === true) {
      const vote = {
        userId: user.ID,
        name: user.name,
        comment: comment,
        starVote: star,
        created: Date().toString(),
      };
      await axios.put(`/api/products/comment/${ID}`, { vote });
      toast.success(`Đã gửi đánh giá`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else
      toast.error(`Vui lòng nhập nội dung bình luận`, {
        position: toast.POSITION.TOP_CENTER,
      });
  };
  return (
    <MainLayout>
      {item === undefined ? (
        <p>{error}</p>
      ) : (
        <div className="product">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <div className="previewImg">
                  <Tabs id="imageTab" className="mb-3">
                    {item.image.map((item, index) => {
                      return (
                        <Tab
                          key={item.id}
                          eventKey={`#image-${index}`}
                          title={
                            <img
                              className="img-fluid"
                              src={item.url}
                              alt="sneaker-product"
                            />
                          }
                        >
                          <a
                            data-fancybox="gallery"
                            href={item.url}
                            className="img-wrap"
                          >
                            <img src={item.url} alt="" />
                          </a>
                        </Tab>
                      );
                    })}
                  </Tabs>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="info">
                  <span className="name">{item.name}</span>
                  <div className="size my-3">
                    <span>Size:</span>
                    <Tabs id="sizeTab" className="mb-3">
                      {item.size.map((item, index) => {
                        return (
                          <Tab
                            key={item.id}
                            eventKey={`#size-${index}`}
                            onSelect={(e) => {}}
                            title={item.sizeId}
                          >
                            <span className="price">
                              {Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price)}
                            </span>
                          </Tab>
                        );
                      })}
                    </Tabs>
                  </div>
                  <div className="count d-flex align-items-center mb-3">
                    Số lượng
                    <div className="number">
                      <button
                        onClick={() => {
                          if (count <= 0) {
                            setCount(0);
                          } else setCount(count - 1);
                        }}
                        className="minus"
                      >
                        -
                      </button>
                      <input
                        onChange={(e) => {
                          setCount(e.target.value);
                        }}
                        type="text"
                        value={count}
                      />
                      <button
                        onClick={() => {
                          setCount(count + 1);
                        }}
                        className="plus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="controls d-flex">
                    <button
                      onClick={(e) => {
                        handleAddCart();
                      }}
                      className="btn cart"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                  <div className="policy">
                    <span>Chính sách và ưu đãi</span>
                    <ul>
                      <li>
                        <i className="bi bi-globe"></i> Free ship toàn quốc
                      </li>
                      <li>
                        <i className="bi bi-repeat"></i> Hoàn tiền 100% nếu
                        không hài lòng
                      </li>
                      <li>
                        <i className="bi bi-tag"></i>Có thể áp dụng mã giảm giá{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-10">
                <div className="desc mt-3">
                  <span>Mô Tả</span>
                  <p className="mt-3">&emsp; {item.desc}</p>
                </div>
              </div>
              <div className="col-10 voting">
                <div className="heading">
                  <h5>Đánh giá sản phẩm</h5>
                </div>
                <div className="vote__menu">
                  <div className="vote__info">
                    <p className="vote__info-star">
                      {item.vote.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue.starVote;
                      }, 0) / item.vote.length}
                      /5
                    </p>
                    <span>
                      <Rate
                        disabled
                        allowHalf
                        defaultValue={
                          item.vote.reduce((previousValue, currentValue) => {
                            return previousValue + currentValue.starVote;
                          }, 0) / item.vote.length
                        }
                        style={{
                          position: "relative",
                          top: "-1px",
                          fontSize: "15px",
                          marginLeft: "10px",
                          color: "#f59e0b",
                        }}
                      />
                    </span>
                    <p className="vote__info-des">
                      <b>{item.length}</b> đánh giá và nhận xét
                    </p>
                  </div>
                  <div className="vote__board text-center">
                    <span className="vote__board-item">
                      <span>5</span>
                      <Rate
                        disabled
                        defaultValue={1}
                        count={1}
                        style={{
                          position: "relative",
                          top: "-1px",
                          fontSize: "15px",
                          margin: "0 5px",
                          color: "#f59e0b",
                        }}
                      />
                      <span>
                        {item.vote.filter((elem) => elem.starVote === 5).length}{" "}
                        đánh giá
                      </span>
                    </span>
                    <span className="vote__board-item">
                      <span>4</span>
                      <Rate
                        disabled
                        defaultValue={1}
                        count={1}
                        style={{
                          position: "relative",
                          top: "-1px",
                          fontSize: "15px",
                          margin: "0 5px",
                          color: "#f59e0b",
                        }}
                      />
                      <span>
                        {item.vote.filter((elem) => elem.starVote === 4).length}{" "}
                        đánh giá
                      </span>
                    </span>
                    <span className="vote__board-item">
                      <span>3</span>
                      <Rate
                        disabled
                        defaultValue={1}
                        count={1}
                        style={{
                          position: "relative",
                          top: "-1px",
                          fontSize: "15px",
                          margin: "0 5px",
                          color: "#f59e0b",
                        }}
                      />
                      <span>
                        {item.vote.filter((elem) => elem.starVote === 3).length}{" "}
                        đánh giá
                      </span>
                    </span>
                    <span className="vote__board-item">
                      <span>2</span>
                      <Rate
                        disabled
                        defaultValue={1}
                        count={1}
                        style={{
                          position: "relative",
                          top: "-1px",
                          fontSize: "15px",
                          margin: "0 5px",
                          color: "#f59e0b",
                        }}
                      />
                      <span>
                        {item.vote.filter((elem) => elem.starVote === 2).length}{" "}
                        đánh giá
                      </span>
                    </span>
                    <span className="vote__board-item">
                      <span>1</span>
                      <Rate
                        disabled
                        defaultValue={1}
                        count={1}
                        style={{
                          fontSize: "15px",
                          margin: "0 5px",
                          color: "#f59e0b",
                        }}
                      />
                      <span>
                        {item.vote.filter((elem) => elem.starVote === 1).length}{" "}
                        đánh giá
                      </span>
                    </span>
                    {item.vote.some((elem) => {
                      return elem.userId === user.ID;
                    }) ? (
                      <div className="btn">Đã Đánh Giá</div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleShow();
                        }}
                      >
                        ĐÁNH GIÁ NGAY
                      </Button>
                    )}
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                      </Modal.Header>
                      {user.ID ? (
                        <Modal.Body className="text-center">
                          <p className="vote-star">
                            <Rate
                              defaultValue={0}
                              className="my-3"
                              onChange={(e) => {
                                setStar(e);
                              }}
                            />
                          </p>
                          <textarea
                            id="comment"
                            name="comment"
                            rows="4"
                            cols="50"
                            value={comment}
                            onChange={(e) => {
                              setComment(e.target.value);
                            }}
                          ></textarea>
                          <button
                            onClick={(e) => {
                              addComment(e);
                              setLoaded(!isLoad);
                              setShow(false);
                            }}
                            className="btn"
                          >
                            Bình luận
                          </button>
                        </Modal.Body>
                      ) : (
                        <Modal.Body>
                          <a href="/login" className="btn">
                            Đăng nhập để đánh giá
                          </a>
                        </Modal.Body>
                      )}
                    </Modal>
                  </div>
                </div>

                <div className="vote__comment">
                  {item.vote.length !== 0 ? (
                    item.vote.map((elm) => (
                      <div className="vote__comment-item" key={elm.id}>
                        <div className="vote__comment-heading">
                          <div className="vote__comment-user">
                            <span className="vote__comment-ava">
                              {elm.name.charAt(0)}
                            </span>
                            <span className="vote__comment-name">
                              {elm.name}
                            </span>
                          </div>
                          <div className="vote__comment-time">
                            {elm.created}
                          </div>
                        </div>
                        <div className="vote__comment-des">
                          <p>
                            Đánh giá:
                            <Rate
                              disabled
                              character={<i className="bi bi-star-fill"></i>}
                              defaultValue={elm.starVote}
                              style={{
                                fontSize: "15px",
                                marginLeft: "10px",
                                color: "#f59e0b",
                              }}
                            />
                          </p>
                          <p>
                            Nhận xét:
                            <span>{elm.comment}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span>Hiện tại chưa có nhận xét nào</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ProductDetail;
