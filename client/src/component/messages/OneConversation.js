import { useSelector } from "react-redux";
import classes from "./OneConversation.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const OneConversation = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);

  const other = props.conversation?.users.filter((u) => u._id !== user._id);
  console.log(props.conversation?.latestMessage?.creadtedAt);
  return (
    <div
      className={`${classes.conversation} ${
        params.messageId === props.conversation._id && classes.active
      }`}
      onClick={() => navigate(`/messages/${props.conversation._id}`)}
    >
      <img className={classes.img} src={other[0]?.photo} alt="" />
      <div className={classes.dataUser}>
        <div className={classes.dataTop}>
          <p className={classes.userName}>{other[0]?.username}</p>
          <p className={classes.date}>
            {moment(props.conversation?.latestMessage?.createdAt).fromNow()}
          </p>
        </div>
        <div className={classes.textCon}>
          <p className={classes.sender}>
            {props.conversation?.latestMessage?.sender?._id === user._id
              ? "You:"
              : ""}
          </p>
          <p className={classes.text}>
            {props.conversation.latestMessage?.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OneConversation;
