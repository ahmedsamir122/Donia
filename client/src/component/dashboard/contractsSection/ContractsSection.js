import * as React from "react";
import classes from "./ContractsSection.module.css";
import { Outlet } from "react-router-dom";

const ContractsSection = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
export default ContractsSection;
