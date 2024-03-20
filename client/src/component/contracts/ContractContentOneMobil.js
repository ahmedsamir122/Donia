import { Link } from "react-router-dom";
import classes from "./ContractContentOneMobil.module.css";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";

const ContractContentOneMobil = (props) => {
  const navigate = useNavigate();

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
        <div
          className={classes.chatCon}
          onClick={() => navigate(`/messages/${props.onData?.conversation}`)}
        >
          <p className={classes.chat}>Chat</p>
        </div>
      </div>
    </div>
  );
};

export default ContractContentOneMobil;
