import { useSelector } from "react-redux";
import classes from "./OneMessage.module.css";
import dateFormat from "dateformat";

const OneMessage = (props) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div
      className={
        props.own ? `${classes.oneMessageMe}` : `${classes.oneMessageHim}`
      }
    >
      {props.message.sender._id !== user._id && (
        <img src={props.message.sender.photo} alt="" className={classes.img} />
      )}
      <div
        className={props.own ? `${classes.myMessage}` : `${classes.hisMessage}`}
      >
        <span className={classes.text}>{props.message.content}</span>
        <span className={classes.time}>
          {dateFormat(props.message.createdAt, "HH:MM")}
        </span>
      </div>
    </div>
  );
};

export default OneMessage;
