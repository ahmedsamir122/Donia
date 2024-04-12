import classes from "./OneNotification.module.css";
import {
  getWishList,
  URL,
  deleteDataProtect,
} from "../../utils/queryFunctions";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import moment from "moment";

const OneNotification = (props) => {
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const deleteOneNotification = () => {
    return deleteDataProtect(
      `${URL}/api/v1/notification/${props.onData.id}`,
      null,
      token
    );
  };

  const { mutate, isError, error } = useMutation(deleteOneNotification, {
    onSuccess: (data) => {
      console.log("success");
      props.onDeleteNotifications(props.onData.id);
    },
  });

  const deleteNotificationHandler = (e) => {
    e.stopPropagation();
    mutate();
  };

  return (
    <div className={classes.messCon} ref={props.innerRef}>
      {props.onData.content}
      <button className={classes.button} onClick={deleteNotificationHandler}>
        X
      </button>
      <div className={classes.timeAgo}>
        {moment(props.onData.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default OneNotification;
