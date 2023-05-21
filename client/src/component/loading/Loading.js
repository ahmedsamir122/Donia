import classes from "./Loading.module.css";
import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className={classes.main}>
      <TailSpin
        height="80"
        width="80"
        color="#139ff0"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loading;
