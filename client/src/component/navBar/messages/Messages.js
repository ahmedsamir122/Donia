import classes from "./Messages.module.css";
import user from "../../../img/user.jpg";
import { CiSearch } from "react-icons/ci";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";
import AllConversations from "../../messages/AllConversations";

const Messages = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onMessage} />
        </div>
        <h2 className={classes.title}>Messages</h2>
        <Link to="/messages" className={classes.link}>
          view all
        </Link>
      </div>
      <form className={classes.form}>
        <input
          type="search"
          className={classes.input}
          placeholder="search messenger..."
        />
        <button className={classes.button}>
          <CiSearch />
        </button>
      </form>
      <AllConversations />
    </div>
  );
};

export default Messages;
