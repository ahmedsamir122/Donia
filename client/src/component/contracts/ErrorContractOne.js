import classes from "./ErrorContract.module.css";
const ErrorContractOne = (props) => {
  return (
    <div className={classes.errorOne}>
      <p className={classes.errorName}>{props.name} </p>
      <p className={classes.errorMark}>!</p>
    </div>
  );
};

export default ErrorContractOne;
