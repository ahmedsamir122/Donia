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
import { useMutation } from "react-query";
import axios from "axios";
import { URL } from "../../utils/queryFunctions";

const logOut = () => {
  return axios.get(`${URL}/api/v1/users/logout`);
};

const Account = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { mutate, isError, error } = useMutation(logOut, {
    onSuccess: (data) => {
      localStorage.removeItem("token");
      dispatch(authActions.logout());
      navigate("/");
    },
  });

  const logoutHandler = () => {
    mutate();
  };

  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onAccount} />
        </div>
        <h2 className={classes.title}>Account</h2>
      </div>
      <Link
        className={classes.messCon}
        to={`/${user.username}`}
        onClick={() => props.onAccount()}
      >
        <img src={user.photo} alt="" className={classes.img} />
        <span className={classes.username}>{user.username}</span>
      </Link>
      <Link
        to={`/${user.username}`}
        className={classes.viewProfile}
        onClick={() => props.onAccount()}
      >
        View Profile
      </Link>
      <Link
        className={classes.item}
        to="/settings"
        onClick={() => props.onAccount()}
      >
        <SettingsIcon className={classes.icon} />
        <div className={classes.iconName}>Setting & privacy</div>
      </Link>
      <Link
        className={classes.item}
        to="/contracts"
        onClick={() => props.onAccount()}
      >
        <LibraryBooksIcon className={classes.icon} />
        <div className={classes.iconName}>Contracts</div>
      </Link>
      <Link
        className={classes.item}
        to="/wishList"
        onClick={() => props.onAccount()}
      >
        <AiOutlineHeart className={classes.icon} />
        <div className={classes.iconName}>My Wishlist</div>
      </Link>
      {/* <Link
        className={classes.item}
        to="/help"
        onClick={() => props.onAccount()}
      >
        <HelpIcon className={classes.icon} />
        <div className={classes.iconName}>Help</div>
      </Link> */}
      <div className={classes.item} onClick={logoutHandler}>
        <MdOutlineLogout className={classes.iconLogout} />
        <div className={classes.iconLogoutName}>Logout</div>
      </div>
    </div>
  );
};

export default Account;
