import { Link } from "react-router-dom";
import classes from "./ContractContentOneMobil.module.css";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { postDataProtect, URL } from "../utils/queryFunctions";
import { useMutation } from "react-query";

let y = "active";
const ContractContentOneMobil = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const postData = (data, id) => {
    return postDataProtect(
      `${URL}/api/v1/conversations/${props.onData.id}`,
      data,
      token
    );
  };

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data);
      navigate(`/messages/${data.data.data.conversation._id}`);
    },
  });
  const chatHandler = () => {
    mutate();
  };

  return (
    <div className={classes.contract}>
      <div className={classes.topContract}>
        <div className={classes.dateContract}>
          {dateFormat(props.onData.createdAt, "fullDate")}
        </div>
        <p className={classes.statusContract}>{props.onData.activity}</p>
      </div>
      <Link
        to={`/contracts/${props.onData?.id}`}
        className={classes.nameContract}
      >
        {props.onData.name}
      </Link>
      <div className={classes.bottomContract}>
        {props.client && (
          <Link
            to={`/${props.onData?.freelancer.username}`}
            className={classes.userContract}
          >
            {props.onData?.freelancer.username}
          </Link>
        )}
        {!props.client && (
          <Link
            to={`/u/${props.onData?.client.username}`}
            className={classes.userContract}
          >
            {props.onData?.client.username}
          </Link>
        )}
        <div className={classes.chatCon} onClick={chatHandler}>
          <div
            className={`${classes.chatPoint} ${
              y === "active" && classes.activeChat
            }`}
          ></div>
          <p className={classes.chat}>Chat</p>
        </div>
      </div>
    </div>
  );
};

export default ContractContentOneMobil;
