import * as React from "react";
import classes from "./ReportsSection.module.css";
import { Outlet } from "react-router-dom";

const ReportsSection = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
export default ReportsSection;
