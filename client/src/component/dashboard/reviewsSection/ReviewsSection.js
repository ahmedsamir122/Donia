import { Outlet } from "react-router-dom";
import classes from "./ReviewsSection.module.css";

const ReviewsSection = () => {
  return (
    <div className={classes.container}>
      <Outlet />
    </div>
  );
};
export default ReviewsSection;
