import classes from "./ErrorContract.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Link } from "react-router-dom";
import ErrorContractOne from "./ErrorContractOne";

const ErrorContract = (props) => {
  console.log(props.onError);
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
        {!props.onError.includes("accept") && (
          <p className={classes.errorContent}>
            You can't open a contract with this talent because you don't match
            with required qualifications
          </p>
        )}
        {props.onError.includes("accept") && (
          <p className={classes.errorContent}>{props.onError}</p>
        )}
        {!props.onError.includes("accept") && (
          <h3 className={classes.errorTitle}>The prefered qualifications</h3>
        )}
        {!props.onError.includes("accept") && (
          <div className={classes.errorCon}>
            {props.onError.split("-").map((item, i) => (
              <ErrorContractOne name={item} />
            ))}
          </div>
        )}
        <p className={classes.errorContent}>
          Try to find another talent from <Link to="/">here</Link>
        </p>
      </div>
    </div>
  );
};

export default ErrorContract;
