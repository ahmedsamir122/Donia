import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useQuery } from "react-query";
import classes from "./ReportSection.module.css";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import dateFormat from "dateformat";
import TableComponent from "../../tableComponent/TableComponent";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ReportSection = () => {
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchReport = () => {
    return axios.get(`${URL}/api/v1/reports/${id}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const addNote = () => {
    return axios.post(
      `${URL}/api/v1/notes/`,
      { report: id, description: document.querySelector("input").value },
      {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      }
    );
  };

  const updateReport = () => {
    return axios.patch(
      `${URL}/api/v1/reports/${id}`,
      { status: document.querySelector("#status").value },
      {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      }
    );
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "report",
    fetchReport,

    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        console.log(fetchedData.data.data.report.notes);
        setRows(
          fetchedData.data.data.report.notes.map((note) =>
            createData(
              note.writer.username,
              dateFormat(note.createdAt, " mmmm dS, yyyy"),
              note.description
            )
          )
        );
      },
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  function createData(writer, createdAt, description) {
    return { writer, createdAt, description };
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
    { id: "writer", label: "Writer", minWidth: 170 },
    {
      id: "createdAt",
      label: "CreatedAt",
      minWidth: 170,
    },
    {
      id: "description",
      label: "Description",
      minWidth: 170,
    },
  ];

  const handleAddBtn = () => {
    setShowInput(true);
  };
  const handlecloseBtn = () => {
    setShowInput(false);
  };
  const handleReportStatus = () => {
    document.querySelector("#status").value === data.data.data.report.status
      ? withReactContent(Swal).fire("This is The Currrent Status")
      : withReactContent(Swal)
          .fire({
            title: "Are you sure?",
            text: `You will Change Report Status`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure",
          })
          .then((result) => {
            if (result.isConfirmed) {
              updateReport()
                .then(() => {
                  Swal.fire({
                    title: "Success",
                    text: `You Change Report Status`,
                    icon: "success",
                  });
                  refetch();
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    text: `Failed to Change Report Status. ${error.message}`,
                    icon: "error",
                  });
                });
            }
          });
  };

  const showSwal = () => {
    document.querySelector("input").value === ""
      ? withReactContent(Swal).fire("Can't Add Empty Note")
      : withReactContent(Swal)
          .fire({
            title: "Are you sure?",
            text: `You will Add Note`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Sure",
          })
          .then((result) => {
            if (result.isConfirmed) {
              addNote()
                .then(() => {
                  Swal.fire({
                    title: "Success",
                    text: `You Add Note`,
                    icon: "success",
                  });
                  setShowInput(false);
                  refetch();
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Error",
                    text: `Failed to add user. ${error.message}`,
                    icon: "error",
                  });
                });
            }
          });
  };

  return (
    <>
      <h2>Report Details</h2>
      <div className={classes.userContainer}>
        <div className={classes.reportDetails}>
          <div className={classes.row}>
            <h4>Type</h4>
            <p>{data.data.data.report.type}</p>
          </div>
          <div className={classes.row}>
            <h4>complainer</h4>
            <p>{data.data.data.report.complainer.username}</p>
          </div>
          <div className={classes.row}>
            <h4>Cotract ID</h4>
            <p>{data.data.data.report.complainerAbout}</p>
          </div>
          <div className={classes.row}>
            <h4>Status</h4>
            <p>{data.data.data.report.status}</p>
          </div>
          <div className={classes.row}>
            <h4>CreatedAt</h4>
            <p>
              {dateFormat(data.data.data.report.createdAt, " mmmm dS, yyyy")}
            </p>
          </div>
          <div className={classes.row}>
            <h4>Description</h4>
            <p>{data.data.data.report.description}</p>
          </div>
        </div>
        <div className={classes.status}>
          <fieldset>
            <legend>Status:</legend>
            <label>Change Report Status</label>
            <select id="status">
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            <button onClick={handleReportStatus}>Submit</button>
          </fieldset>
        </div>
      </div>

      <TableComponent
        columns={columns}
        rows={rows}
        count={data.data.data.report.notes.length}
        page={page}
        handleChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        pT={"Notes"}
      />

      {showInput ? (
        <button className={classes.submitBtn} onClick={showSwal}>
          Submit
        </button>
      ) : (
        <button className={classes.addBtn} onClick={handleAddBtn}>
          Add Note
        </button>
      )}
      {showInput ? (
        <div>
          <input
            className={classes.noteInput}
            placeholder="Add Note"
            required
          ></input>
          <CloseOutlinedIcon
            className={classes.closeBtn}
            onClick={handlecloseBtn}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ReportSection;
