import classes from "./Backdrop.module.css";
const Backdrop = (props) => {
  return (
    <div
      className={classes.background}
      onClick={() => props.onHideHandler()}
    ></div>
  );
};

export default Backdrop;
