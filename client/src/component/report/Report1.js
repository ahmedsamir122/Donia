import classes from "./Report1.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useState } from "react";
const Report1 = (props) => {
  const defaultData = [
    { id: 1, name: "Nudity", isChecked: false },
    { id: 2, name: "Spam", isChecked: false },
    { id: 3, name: "Violence", isChecked: false },
    { id: 4, name: "Hate speech", isChecked: false },
    { id: 5, name: "False information", isChecked: false },
    { id: 6, name: "Something else", isChecked: false },
  ];
  const [data, setData] = useState(defaultData);
  const [report, setReport] = useState("");

  function handleChange(e) {
    const value = e.target.value;
    const modifiedData = [...data];
    modifiedData.map((item) => {
      item.isChecked = item.name === value;
      return item;
    });
    setData(modifiedData);
    setReport(value);
    console.log(value);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    props.onClick();
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Report</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <form className={classes.inputsCon} onSubmit={submitHandler}>
        {data.map((item, index) => (
          <div className={classes.inputCon} key={item.id}>
            <input
              type="Checkbox"
              value={item.name}
              onChange={(e) => handleChange(e)}
              checked={item.isChecked}
              className={classes.input}
              id={item.id}
            />
            <label className={classes.label} htmlFor={item.id}>
              {item.name}
            </label>
          </div>
        ))}
        <p className={classes.comment}>
          If you want to add a comment(optional)
        </p>
        <textarea className={classes.textArea}></textarea>
        <div className={classes.buttonCon}>
          <button className={classes.button}>Submit</button>
          <button
            onClick={() => props.onClick()}
            className={classes.button}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report1;
