import classes from "../UserSection.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { URL } from "../../../../utils/queryFunctions";
import Loading from "../../../../loading/Loading";
import TableComponent from "../../../tableComponent/TableComponent";

const UserReports = () => {
  const { username } = useParams();
  const [page, setPage] = React.useState(0);
  const [url, setUrl] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const navigate = useNavigate();
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchUserReports = () => {
    return axios.get(`${URL}/api/v1/reports/userReports/${username}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "talent",
    fetchUserReports,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        setRows(
          fetchedData.data.data.reports.map((report) =>
            createData(report.id, report.complainer.username)
          )
        );
      },
    }
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleUserClick = (id) => {
    navigate(`/dashboard/reports/${id}`);
  };

  if (isLoading || isFetching) {
    return (
      <div className={classes.mainLoading}>
        <Loading />
      </div>
    );
  }

  if (isError || !data) {
    return <div>{error?.response.data.message}</div>;
  }
  function createData(id, complainer) {
    return { id, complainer };
  }

  const columns = [
    {
      id: "id",
      label: "ID",
      minWidth: 170,
    },
    {
      id: "complainer",
      label: "Complainer",
      minWidth: 170,
    },
  ];

  return (
    <>
      <>
        <TableComponent
          columns={columns}
          rows={rows}
          count={data.data.totalReports}
          page={page}
          handleChangePage={handleChangePage}
          handleUserClick={handleUserClick}
          rowsPerPage={rowsPerPage}
          pT={"UserProfile"}
        />
      </>
    </>
  );
};
export default UserReports;
