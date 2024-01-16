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

const ReportsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [url, setUrl] = useState("");
  const [tableVisible, setTableVisible] = useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";

  const postData = (data) => {
    return axios.post(`${URL}/api/v1/reports/`, data, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

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

  const {
    mutate,
    isError: mutationError,
    error: mutationErrorMsg,
  } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    console.log(error);
    const [type, complainerAbout, complainer, description] = getValues([
      "type",
      "complainerAbout",
      "complainer",
      "description",
    ]);

    mutate({
      type,
      complainerAbout,
      complainer,
      description,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    refetch();
  }, [url, page, refetch, data?.data.reports]);

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
    if (!tableVisible)
      return (
        <form onSubmit={handleSubmit(onsubmit)}>
          <h2>Submit a Report</h2>
          <label>Enter Complainer ID</label>

          <input
            type="text"
            id="complainer"
            {...register("complainer", { required: true })}
            className={classes.textInput}
          />

          <label>Enter Contract ID</label>

          <input
            type="text"
            id="contractId"
            {...register("complainerAbout", { required: true })}
            className={classes.textInput}
          />

          <label>Choose Type</label>

          <select
            id="type"
            {...register("type", { required: true })}
            className={classes.typeGroup}
          >
            <option value="user">Client</option>
            <option value="talent">Talent</option>
            <option value="review">Review</option>
          </select>
          <p>
            <label>Write a description of problem:</label>
          </p>
          <textarea
            {...register("description", { required: true })}
            id="description"
            className={classes.description}
            rows="10"
            cols="94"
          ></textarea>
          <button className={classes.submitBtn}>Submit</button>
        </form>
      );
    else
      return (
        <TableComponent
          columns={columns}
          rows={rows}
          count={data.data.reports}
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
