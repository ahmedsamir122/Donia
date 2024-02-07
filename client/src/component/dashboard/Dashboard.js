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
import { authActions } from "../../store/login-slice";
import { useEffect } from "react";
const Dashboard = () => {
  const tokenLocal = localStorage.getItem("token") || "";
  const dispatch = useDispatch();
  const activeReports = useSelector((state) => state.reports.activeReports);

  const fetchReports = () => {
    return axios.get(`${URL}/api/v1/reports/`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const fetchUser = () => {
    return axios.get(`${URL}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };
  const {} = useQuery("reports", fetchReports, {
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      dispatch(reportsActions.updateActiveReports(fetchedData.data));
    },
  });
  const {} = useQuery("user", fetchUser, {
    refetchOnWindowFocus: false,
    onSuccess: (fetchedData) => {
      dispatch(authActions.login(fetchedData.data.data.user));
    },
  });

  const handleBtnClick = (e) => {
    const isLinkWithinListItem =
      e.target.tagName.toLowerCase() === "a" && e.target.closest("li");

    if (isLinkWithinListItem) {
      document.querySelectorAll(`.${classes.sideNav} li a`).forEach((item) => {
        item.style.color = "";
      });

      e.target.style.color = "rgba(0, 0, 0, 0.9)";
    }
  };

  const handleLogoutBtn = () => {
    localStorage.clear();
  };

  return (
    <div className={classes.container}>
      <div
        className={classes.sideNav}
        onClick={(e) => {
          handleBtnClick(e);
        }}
      >
        <Link className={classes.logo} to="/dashboard/">
          Logo
        </Link>
        <ul>
          <li>
            <ComputerIcon className={classes.black} />
            <Link to="/dashboard/">Dashboard</Link>
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
          <Link
            className={classes.logoutBtn}
            to="/signin"
            onClick={handleLogoutBtn}
          >
            Sign Out
          </Link>
        </ul>
      </div>
      <div className={classes.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};
export default Dashboard;
