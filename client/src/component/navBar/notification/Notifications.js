import classes from "./Notifications.module.css";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import OneNotification from "./OneNotification";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import Loading from "../../loading/Loading";

const Notifications = (props) => {
  const { ref, inView } = useInView();
  const wasInView = useRef(false);

  useEffect(() => {
    if (inView && !wasInView.current && props.hasNextPage) {
      props.onPageHandler();
      wasInView.current = true;
    }
    // Cleanup function
    return () => {
      wasInView.current = inView;
    };
  }, [inView, props]);

  console.log(props.loading);
  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onNotification} />
        </div>
        <h2 className={classes.title}>Notification</h2>
      </div>
      {props.dataNotes.length > 0 &&
        props.dataNotes.map((note, index) => {
          if (props.dataNotes.length === index + 1) {
            return <OneNotification onData={note} innerRef={ref} />;
          }
          return <OneNotification onData={note} />;
        })}
      {props.dataNotes.length === 0 && (
        <div> there is no notifications found</div>
      )}
      {props.loading && (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Notifications;
