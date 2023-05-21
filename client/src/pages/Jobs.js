import JobsPage from "../component/jobs/JobsPage";
import React from "react";
import { Outlet } from "react-router-dom";
const Jobs = () => {
  return (
    <React.Fragment>
      <JobsPage />
      <Outlet />
    </React.Fragment>
  );
};

export default Jobs;
