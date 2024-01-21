import classes from "./Dashboard.module.css";
import ComputerIcon from "@mui/icons-material/Computer";
import PersonIcon from "@mui/icons-material/Person";
import ReportIcon from "@mui/icons-material/Report";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DashboardSection from "./dashboardSection/DashboardSection";
import UsersSectiion from "./usersSectiion/UsersSectiion";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import { URL } from "../utils/queryFunctions";
import { reportsActions } from "../../store/reports";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
const Dashboard = () => {
  const tokenLocal = localStorage.getItem("token") || "";
  const dispatch = useDispatch();
  const activeReports = useSelector((state) => state.reports.activeReports);

  const fetchReports = () => {
    return axios.get(`${URL}/api/v1/reports/`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };
  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "reports",
    fetchReports,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        dispatch(reportsActions.updateActiveReports(fetchedData.data));
      },
    }
  );

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
            {activeReports ? (
              <span className={classes.activeReports}>{activeReports}</span>
            ) : (
              ""
            )}
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
