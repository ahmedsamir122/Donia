import classes from "./JobsFreelancer.module.css";
import { useNavigate } from "react-router-dom";
const JobsFreelancer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className={classes.top}>
        <div className={classes.title} onClick={() => navigate("/me/jobs/all")}>
          All
        </div>
        <div
          className={classes.title}
          onClick={() => navigate("/me/jobs/offers")}
        >
          Offers
        </div>
        <div
          className={classes.title}
          onClick={() => navigate("/me/jobs/active")}
        >
          Active jobs
        </div>
        <div
          className={classes.title}
          onClick={() => navigate("/me/jobs/finished")}
        >
          Finished
        </div>
      </div>
    </div>
  );
};

export default JobsFreelancer;
