import classes from "./Notifications.module.css";
import user from "../../../img/user.jpg";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

const Notifications = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onNotification} />
        </div>
        <h2 className={classes.title}>Notification</h2>
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

export default Notifications;
