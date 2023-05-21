import classes from "./BlockedList.module.css";
import { useNavigate } from "react-router-dom";
import UnBlockButton from "./UnBlockButton";
const BlockListOne = (props) => {
  const navigate = useNavigate();

  return (
    <div className={classes.accountCon}>
      <div
        className={classes.account}
        onClick={() => navigate(`/u/${props.username}`)}
      >
        <img className={classes.img} src={props.photo} alt="" />
        <p className={classes.name}>{props.username}</p>
      </div>
      <UnBlockButton
        username={props.username}
        photo={props.photo}
        id={props.id}
      />
    </div>
  );
};

export default BlockListOne;
