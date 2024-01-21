import classes from "./DashboardSection.module.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSelector } from "react-redux";

const DashboardSection = () => {
  const activeReports = useSelector((state) => state.reports.activeReports);
  const totalReports = useSelector((state) => state.reports.totalReports);
  const completeReports = useSelector((state) => state.reports.completeReports);
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <div className={classes.header}>
        <h2>Dashboard</h2>
        <p>Welcome Ahmed</p>
      </div>

      <div className={classes.cards}>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Total Reports</h5>
            <span>{totalReports}</span>
          </div>
          <div className={`${classes.logo} ${classes.bColor}`}>
            <BarChartIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Completed</h5>
            <span>{completeReports}</span>
          </div>
          <div className={`${classes.logo} ${classes.gColor}`}>
            <TaskAltIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.card}>
          <div className={classes.cardInfo}>
            <h5>Workiing On</h5>
            <span>{activeReports}</span>
          </div>
          <div className={`${classes.logo} ${classes.oColor}`}>
            <HourglassBottomIcon className={classes.icon} />
          </div>
        </div>
      </div>
    </>
  );
};
export default DashboardSection;
