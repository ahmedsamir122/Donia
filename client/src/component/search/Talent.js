import classes from "./Talent.module.css";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import HalfRating from "../rating/Rate";
import IconWishList from "./IconWishList";

const Talent = (props) => {
  const navigate = useNavigate();

  return (
    <div
      className={classes.card}
      onClick={() => navigate(`/${props.username}`)}
    >
      <img className={classes.img} src={props.photo} alt="" />
      <div className={classes.middle}>
        <div className={classes.name}>{props.username}</div>
        <div className={classes.location}>
          <CiLocationOn />
          <div className={classes.city}>{`${props.city}, `} </div>
          <div className={classes.city}>{props.country} </div>
        </div>
        <div className={classes.rate}>
          <HalfRating value={props.ratingsAverageF} />
          <div className={classes.reviewValue}>{props.ratingsAverageF}</div>
          <div
            className={classes.reviewValue}
          >{`(${props.ratingsQuantityF} reviews)`}</div>
        </div>
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

export default Talent;
