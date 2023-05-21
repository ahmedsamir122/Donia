import classes from "./Account.module.css";
import user1 from "../../../img/user.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../../store/login-slice";

const Account = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onAccount} />
        </div>
        <h2 className={classes.title}>Account</h2>
      </div>
      <div className={classes.messCon}>
        <img src={user.photo} alt="" className={classes.img} />
        <Link to={`/${user.username}`} className={classes.messContent}>
          <div>{user.username}</div>
        </Link>
      </div>
      <Link to={`/${user.username}`} className={classes.viewProfile}>
        View Profile
      </Link>
      <Link className={classes.item} to="/settings">
        <SettingsIcon className={classes.icon} />
        <div className={classes.iconName}>Setting & privacy</div>
      </Link>
      <Link className={classes.item} to="/contracts">
        <LibraryBooksIcon className={classes.icon} />
        <div className={classes.iconName}>Contracts</div>
      </Link>
      <Link className={classes.item} to="/wishList">
        <AiOutlineHeart className={classes.icon} />
        <div className={classes.iconName}>My Wishlist</div>
      </Link>
      <Link className={classes.item} to="/help">
        <HelpIcon className={classes.icon} />
        <div className={classes.iconName}>Help</div>
      </Link>
      <div className={classes.item} onClick={logoutHandler}>
        <MdOutlineLogout className={classes.iconLogout} />
        <div className={classes.iconLogoutName}>Logout</div>
      </div>
    </div>
  );
};

export default Account;
