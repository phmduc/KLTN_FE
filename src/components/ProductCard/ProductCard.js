import "./ProductCard.css";
import { Link } from "react-router-dom";
function ProductCard(props) {
  return (
    <div className="item">
      <Link to={`./${props.item._id}`} className="img-wrap">
        <img src={props.item.image[0].url} className="main" alt="" />
        <img src={props.item.image[1].url} className="forHover" alt="" />
      </Link>
      <div className="content d-flex flex-column mt-2">
        <Link to={`./${props.item._id}`} className="name">
          {props.item.name}
        </Link>
        <span>{props.item.size.length} size</span>
        <Link className="price" to={`./${props.item._id}`}>
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
