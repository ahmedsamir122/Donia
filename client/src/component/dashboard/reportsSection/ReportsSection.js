import * as React from "react";
import classes from "./ReportsSection.module.css";
import { Outlet } from "react-router-dom";

const ReportsSection = () => {
  return (
    <div className={classes.container}>
      <Outlet />
    </div>
  );
};
export default ReportsSection;
