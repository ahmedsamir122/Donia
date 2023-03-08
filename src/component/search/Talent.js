import classes from "./Talent.module.css";
import { useNavigate } from "react-router-dom";
const Talent = (props) => {
  const navigate = useNavigate();
  return (
    <div className={classes.card}>
      <img className={classes.img} src={props.img} alt="" />
      <div className={classes.name}>{props.name}</div>
      <div className={classes.button} onClick={() => navigate("/talent")}>
        make an offer
      </div>
    </div>
  );
};

export default Talent;
