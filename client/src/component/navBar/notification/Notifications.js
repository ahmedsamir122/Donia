import classes from "./Notifications.module.css";
import user from "../../../img/user.jpg";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import OneConversation from "../../messages/OneConversation";
import OneNotification from "./OneNotification";

const Notifications = (props) => {
  console.log(props.dataNotes.data.notifications);
  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onNotification} />
        </div>
        <h2 className={classes.title}>Notification</h2>
      </div>
      {props.dataNotes.data.notifications.length > 0 &&
        props.dataNotes.data.notifications.map((note) => (
          <OneNotification onData={note} />
        ))}
      {props.dataNotes.data.notifications.length === 0 && (
        <div> there is no notifications found</div>
      )}
    </div>
  );
};

export default Notifications;
