import classes from "./ErrorContract.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";

const ErrorContract = (props) => {
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Contract</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <div className={classes.errorTotal}>
        <p className={classes.errorContent}>
          You can't open a contract with this talent because you don't match
          with required qualifications
        </p>
        <h3 className={classes.errorTitle}>The prefered qualifications</h3>
        <div className={classes.errorCon}>
          <div className={classes.errorOne}>
            <p className={classes.errorName}>Average rate :</p>
            <p className={classes.errorValue}>3</p>
            <p className={classes.errorMark}>!</p>
          </div>
          <div className={classes.errorOne}>
            <p className={classes.errorName}>minimum reviews :</p>
            <p className={classes.errorValue}>2</p>
            <p className={classes.errorMark}>!</p>
          </div>
          <div className={classes.errorOne}>
            <p className={classes.errorName}>City :</p>
            <p className={classes.errorValue}>Jakarta</p>
            <p className={classes.errorMark}>!</p>
          </div>
        </div>
        <p className={classes.errorContent}>
          Try to find another talent from <Link to="/">here</Link>
        </p>
      </div>
    </div>
  );
};

export default ErrorContract;
