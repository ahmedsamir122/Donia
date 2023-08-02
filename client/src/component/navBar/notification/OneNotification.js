import user from "../../../img/user.jpg";
import classes from "./OneNotification.module.css";

const OneNotification = (props) => {
  console.log(props.onData.content);
  return <div className={classes.messCon}>{props.onData.content}</div>;
};

export default OneNotification;
