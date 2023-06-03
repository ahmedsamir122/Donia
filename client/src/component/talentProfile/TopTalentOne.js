import classes from "./TopTalentOne.module.css";
import HalfRating from "../rating/Rate";
import { CiLocationOn } from "react-icons/ci";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { wishlistActions } from "../../store/wishlist";
import { useEffect } from "react";
import BlockedIcon from "./BlockedIcon";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BackDropModal from "../modal/BackDrop";
import PhotoModal from "../modal/PhotoModal";
import IconWishList from "../search/IconWishList";

const TopTalentOne = (props) => {
  const [activeTalent, setActiveTalent] = useState(true);
  const [activeClient, setActiveClient] = useState(false);
  const [showPhotoModal, setShowModal] = useState(false);
  const [booked, setBooked] = useState(false);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const userRed = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const activeTalentHandler = () => {
    setActiveClient(false);
    setActiveTalent(true);
    props.onFreelancer();
    props.onFreelancerAccount();
  };
  const activeClientHandler = () => {
    setActiveClient(true);
    setActiveTalent(false);
    props.onClient();
    props.onClientAccount();
  };

  const showPhotoModalHandler = () => {
    setShowModal((prev) => !prev);
  };
  // const addWishlistHandler = (e) => {
  //   if (!userRed) {
  //     navigate("/signin");
  //     return;
  //   }
  //   dispatch(wishlistActions.toggle(props.onData.id));
  //   console.log(wishlist);
  // };

  useEffect(() => {
    if (wishlist.find((item) => item === props.onData.id)) {
      setBooked(true);
    } else {
      setBooked(false);
    }
  }, [wishlist, props.onData.id]);
  return (
    <div className={classes.topProfile}>
      <div className={classes.info}>
        <div className={classes.imgCon}>
          <img className={classes.img} src={props.onData.photo} alt="" />
          {props.showEdit && (
            <div className={classes.cameraIcon}>
              <PhotoCameraIcon
                className={classes.cameraIconCo}
                onClick={showPhotoModalHandler}
              />
            </div>
          )}
        </div>
        <div className={classes.editIcon}>
          {props.showEdit && props.onData.perform === "talent" && (
            <div className={classes.profileButton}>
              <div
                onClick={activeTalentHandler}
                className={`${classes.userType} ${
                  activeTalent && classes.active
                }`}
              >
                talent
              </div>
              <div
                onClick={activeClientHandler}
                className={`${classes.userType} ${
                  activeClient && classes.active
                }`}
              >
                client
              </div>
            </div>
          )}
        </div>
        <div className={classes.bookIcon}>
          {!props.showEdit && !props.onClientProfile && (
            <IconWishList
              id={props.onData.id}
              username={props.onData.username}
              photo={props.onData.photo}
            />
          )}
          {!props.showEdit && props.onClientProfile && (
            <BlockedIcon
              id={props.onData.id}
              username={props.onData.username}
              photo={props.onData.photo}
            />
          )}
        </div>
        <div className={classes.rightInfo}>
          <h2 className={classes.name}>{props.onData.username}</h2>
          <div className={classes.rate}>
            <HalfRating value={props.ratingsAverage} />
            <div className={classes.reviewValue}>
              {props.ratingsAverage.toFixed(2)}
            </div>
            <div
              className={classes.reviewValue}
            >{`(${props.ratingsQuantity} reviews)`}</div>
          </div>
          <div className={classes.location}>
            <CiLocationOn />
            <div className={classes.city}>{`${props.onData.city}, `}</div>
            <div className={classes.city}>{`${props.onData.country}`} </div>
          </div>
        </div>
      </div>
      {showPhotoModal && <PhotoModal onClick={showPhotoModalHandler} />}
      {showPhotoModal && <BackDropModal onClick={showPhotoModalHandler} />}
    </div>
  );
};

export default TopTalentOne;
