import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useQuery } from "react-query";
import classes from "./ReportSection.module.css";
import { useSelector } from "react-redux";

const ReportSection = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchReport = () => {
    return axios.get(`${URL}/api/v1/reports/${id}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "report",
    fetchReport,
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return <div>{error?.Msg}</div>;
  }

  return (
    <>
      <div>hi</div>
    </>
  );
};

export default ReportSection;
