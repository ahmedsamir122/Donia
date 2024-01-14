import classes from "./Dashboard.module.css";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import ReportIcon from "@mui/icons-material/Report";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DashboardSection from "./dashboardSection/DashboardSection";
import UsersSectiion from "./usersSectiion/UsersSectiion";
import { Link, Routes, Route, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className={classes.container}>
      <div className={classes.sideNav}>
        <Link className={classes.logo} to="/dashboard/">
          Logo
        </Link>
        <ul>
          <li>
            <ComputerIcon className={classes.black} />
            <Link to="/dashboard/dashboard/">Dashboard</Link>
          </li>
          <li>
            <PersonIcon className={classes.black} />
            <Link to="/dashboard/users/">Users</Link>
          </li>
          <li>
            <SummarizeIcon className={classes.black} />
            <Link to="/dashboard/contracts/">Contracts</Link>
          </li>
          <li>
            <ReviewsIcon className={classes.black} />
            <Link to="/dashboard/reviews/">Reviews</Link>
          </li>
          <li>
            <ReportIcon className={classes.black} />
            <Link to="/dashboard/reports/">Reports</Link>
          </li>
        </ul>
      </div>
      <div className={classes.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};
export default Dashboard;
