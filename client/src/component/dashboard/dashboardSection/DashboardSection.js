import classes from "./DashboardSection.module.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import { URL } from "../../utils/queryFunctions";
import { useEffect, useState } from "react";

const DashboardSection = () => {
  const tokenLocal = localStorage.getItem("token") || "";
  const activeReports = useSelector((state) => state.reports.activeReports);
  const totalReports = useSelector((state) => state.reports.totalReports);
  const completeReports = useSelector((state) => state.reports.completeReports);
  const user = useSelector((state) => state.auth.user);
  const [adminStats, setAdminStats] = useState([]);

  const fetchStats = () => {
    return axios.get(`${URL}/api/v1/reports/admin-stats`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  useEffect(() => {
    if (user?.role === "supervisor") {
      fetchStats()
        .then((response) => {
          setAdminStats(response.data.data.stats);
        })
        .catch((error) => {
          console.error("Error fetching admin stats:", error);
        });
    }
  }, [user, tokenLocal]);
  const renderContent = () => {
    if (user?.role === "admin") {
      return (
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
      );
    }
    if (user?.role === "supervisor") {
      return (
        <div className={classes.admins}>
          {adminStats.map((admin, index) => (
            <div key={index} className={classes.admin}>
              <h4>{admin.admin}</h4>
              <div className={classes.reportInfo}>
                <p>Total Reports: {admin.totalReports}</p>
                <p>Active Reports: {admin.activeReports}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className={classes.header}>
        <h2>Dashboard</h2>
        <p>Welcome {user?.username}</p>
      </div>
      {renderContent()}
    </>
  );
};
export default DashboardSection;
