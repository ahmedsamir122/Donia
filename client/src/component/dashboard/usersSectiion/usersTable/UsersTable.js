import * as React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import classes from "./UsersTable.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import TableComponent from "../../tableComponent/TableComponent";

const UsersTable = () => {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [url, setUrl] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const navigate = useNavigate();

  const fetchTalents = () => {
    return axios.get(`${URL}/api/v1/users?${url}page=${page + 1}&limit=8`);
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "users",
    fetchTalents,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        setRows(
          fetchedData.data.data.users.map((user) =>
            createData(user.username, user.country, user.email, user.perform)
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
    navigate(`/dashboard/users/?page=${page + 1}&limit=8`);
  }, [page]);

  function createData(username, country, email, type) {
    return { username, country, email, type };
  }

  if (isError || !data) {
    return <div>{error?.Msg}</div>;
  }

  const showSwal = (e) => {
    withReactContent(Swal)
      .fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, block!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Blocked!",
            text: "This user has been blocked.",
            icon: "success",
          });
        }
      });
  };

  const columns = [
    { id: "username", label: "UserName", minWidth: 170 },
    {
      id: "country",
      label: "Country",
      minWidth: 170,
    },
    {
      id: "email",
      label: "Email",
      minWidth: 170,
    },
    {
      id: "type",
      label: "Type",
      minWidth: 170,
    },
  ];

  const handleUserClick = (username) => {
    navigate(`/dashboard/users/${username}`);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/dashboard/users/${document.querySelector("input").value}`);
    }
  };

  return (
    <>
      <Outlet />
      <div className={classes.header}>
        <h2>Users</h2>
        <div>
          <SearchOutlinedIcon className={classes.search} />
          <input
            type="text"
            placeholder="Search For User"
            onKeyPress={handleKeyPress}
          ></input>
        </div>
      </div>
      {
        <TableComponent
          data={data.data.data.users}
          columns={columns}
          rows={rows}
          count={data.data.total}
          page={page}
          handleChangePage={handleChangePage}
          handleUserClick={handleUserClick}
          showSwal={showSwal}
          rowsPerPage={rowsPerPage}
          pT={"users"}
        />
      }
    </>
  );
};
export default UsersTable;
