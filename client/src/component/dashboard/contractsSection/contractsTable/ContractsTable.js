import * as React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import classes from "./CotractsTable.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TableComponent from "../../tableComponent/TableComponent";

const ContractsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [url, setUrl] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const navigate = useNavigate();

  const fetchContacts = () => {
    return axios.get(`${URL}/api/v1/contracts?page=${page + 1}&limit=8`);
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "contracts",
    fetchContacts,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        setRows(
          fetchedData.data.data.contracts.map((contract) =>
            createData(
              contract.id,
              contract.name,
              contract.task,
              contract.freelancer.username,
              contract.client.username,
              contract.activity
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
    navigate(`/dashboard/contracts/?page=${page + 1}&limit=8`);
  }, [page]);

  function createData(id, name, task, freelancer, client, status) {
    return { id, name, task, freelancer, client, status };
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
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "task",
      label: "Task",
      minWidth: 170,
    },
    {
      id: "freelancer",
      label: "Freelancer",
      minWidth: 170,
    },
    {
      id: "client",
      label: "Client",
      minWidth: 170,
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
    },
  ];

  const handleUserClick = (id) => {
    navigate(`/dashboard/contracts/${id}`);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/dashboard/contracts/${document.querySelector("input").value}`);
    }
  };

  return (
    <>
      <Outlet />
      <div className={classes.header}>
        <h2>Contracts</h2>
        <div>
          <SearchOutlinedIcon className={classes.search} />
          <input
            type="text"
            placeholder="Search For Contract"
            onKeyPress={handleKeyPress}
          ></input>
        </div>
      </div>
      {
        <TableComponent
          columns={columns}
          rows={rows}
          count={data.data.totalNum}
          page={page}
          handleChangePage={handleChangePage}
          handleUserClick={handleUserClick}
          rowsPerPage={rowsPerPage}
          pT={"Contracts"}
        />
      }
    </>
  );
};
export default ContractsTable;
