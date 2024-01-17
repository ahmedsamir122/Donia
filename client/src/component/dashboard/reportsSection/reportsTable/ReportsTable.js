import * as React from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import classes from "./ReportsTable.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TableComponent from "../../tableComponent/TableComponent";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import NewReportComponent from "../../newReportComponent/NewReportComponent";

const ReportsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [url, setUrl] = useState("");
  const [tableVisible, setTableVisible] = useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchReports = () => {
    return axios.get(`${URL}/api/v1/reports?page=${page + 1}&limit=8`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "reports",
    fetchReports,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        setRows(
          fetchedData.data.data.reports.map((report) =>
            createData(
              report.id,
              report.type,
              report.complainerAbout,
              report.complainer.username,
              report.status
            )
          )
        );
      },
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch();
    navigate(`/dashboard/reports/?page=${page + 1}&limit=8`);
  }, [url, page, refetch, data?.data.totalNum]);

  function createData(id, type, complainerAbout, complainer, status) {
    return { id, type, complainerAbout, complainer, status };
  }

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

  const columns = [
    { id: "id", label: "ID", minWidth: 170 },
    { id: "type", label: "Type", minWidth: 170 },
    { id: "complainerAbout", label: "ComplainerAbout", minWidth: 170 },
    {
      id: "complainer",
      label: "Complainer",
      minWidth: 170,
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
    },
  ];

  const handleUserClick = (id) => {
    navigate(`/dashboard/reports/${id}`);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/dashboard/contracts/${document.querySelector("input").value}`);
    }
  };

  const handleNewReport = () => {
    setTableVisible(!tableVisible);
  };

  const renderContent = () => {
    if (!tableVisible) return <NewReportComponent />;
    else
      return (
        <TableComponent
          columns={columns}
          rows={rows}
          count={data.data.totalNum}
          page={page}
          handleChangePage={handleChangePage}
          handleUserClick={handleUserClick}
          rowsPerPage={rowsPerPage}
          pT={"Reports"}
        />
      );
  };

  return (
    <div className={classes.container}>
      <Outlet />
      <div className={classes.header}>
        <h2>Reports</h2>
        <div>
          {tableVisible ? (
            <button className={classes.reportBtn} onClick={handleNewReport}>
              Create New Report
            </button>
          ) : (
            <button className={classes.reportBtn} onClick={handleNewReport}>
              Close
            </button>
          )}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
export default ReportsTable;
