import classes from "./ReviewSubmit.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import RateEdit from "../rating/RateEdit";
import { useState } from "react";

const ReviewSubmit = (props) => {
  const [rateValue, setRateValue] = useState(0);
  const rateValueHandler = (value) => {
    setRateValue(value);
    console.log(value);
  };

  const submitFrom = (e) => {
    e.preventDefault();
  };
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}></h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <h3 className={classes.subTitle}>Leave a review</h3>
      <form className={classes.form} onSubmit={submitFrom}>
        <div className={classes.rateCon}>
          <RateEdit onRate={rateValueHandler} />
        </div>
        <p className={classes.textAreaTitle}>
          If you want add acomment (optional)
        </p>
        <textarea className={classes.textArea}></textarea>
        <button className={classes.button}>Submit</button>
      </form>
    </div>
  );
};

export default ReviewSubmit;
