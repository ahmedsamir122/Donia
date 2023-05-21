import classes from "./WishListOne.module.css";
import { useNavigate } from "react-router-dom";
import IconWishList from "../search/IconWishList";

const WishListOne = (props) => {
  const navigate = useNavigate();
  console.log(props.username);
  return (
    <div
      className={classes.card}
      onClick={() => navigate(`/${props.username}`)}
    >
      <img className={classes.img} src={props.photo} alt="" />
      <div className={classes.middle}>
        <div className={classes.name}>{props.username}</div>
      </div>
      <div className={classes.bookmark}>
        <IconWishList
          id={props.id}
          username={props.username}
          photo={props.photo}
        />
      </div>
    </div>
  );
};

export default WishListOne;
