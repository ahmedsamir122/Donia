import classes from "./Messages.module.css";
import user from "../../../img/user.jpg";
import { CiSearch } from "react-icons/ci";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";

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

      <div className={classes.messCon}>
        <img src={user} alt="" className={classes.img} />
        <div className={classes.messContent}>
          <div className={classes.messTop}>
            <div>email</div>
            <div>date</div>
          </div>
          <div>You: how r u?</div>
        </div>
      </div>
      <div className={classes.messCon}>
        <img src={user} alt="" className={classes.img} />
        <div className={classes.messContent}>
          <div className={classes.messTop}>
            <div>email</div>
            <div>date</div>
          </div>
          <div>You: how r u?</div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
