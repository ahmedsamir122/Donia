import classes from "./DashboardSection.module.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const DashboardSection = () => {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2>DASHBOARD</h2>
        <p>Welcome Ahmed</p>
      </div>

      <div className={classes.cards}>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Total Reports</h5>
            <span>100</span>
          </div>
          <div className={`${classes.logo} ${classes.bColor}`}>
            <BarChartIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Completed</h5>
            <span>20</span>
          </div>
          <div className={`${classes.logo} ${classes.gColor}`}>
            <TaskAltIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Workiing On</h5>
            <span>10</span>
          </div>
          <div className={`${classes.logo} ${classes.oColor}`}>
            <HourglassBottomIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Not Started</h5>
            <span>70</span>
          </div>
          <div className={`${classes.logo} ${classes.rColor}`}>
            <FormatListBulletedIcon className={classes.icon} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardSection;
