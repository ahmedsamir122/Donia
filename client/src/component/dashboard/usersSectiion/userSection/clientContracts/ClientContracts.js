import classes from "../UserSection.module.css";
import axios from "axios";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { URL } from "../../../../utils/queryFunctions";
import Loading from "../../../../loading/Loading";
import { Outlet, useNavigate } from "react-router-dom";
import TableComponent from "../../../tableComponent/TableComponent";

const ClientContracts = () => {
  const { username } = useParams();
  const { id } = useParams();
  const [page, setPage] = React.useState(0);
  const [url, setUrl] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const navigate = useNavigate();
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchClientContracts = () => {
    return axios.get(
      `${URL}/api/v1/contracts/public-admin-contractsC/${username}`,
      {
        headers: { Authorization: `Bearer ${tokenLocal}` },
      }
    );
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "client",
    fetchClientContracts,
    {
      refetchOnWindowFocus: false,
      onSuccess: (fetchedData) => {
        setRows(
          fetchedData.data.data.contracts.map((contract) =>
            createData(contract.id, contract.freelancer.username)
          )
        );
      },
    }
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleUserClick = (id) => {
    navigate(`/dashboard/contracts/${id}`);
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
  function createData(id, talent) {
    return { id, talent };
  }

  const columns = [
    {
      id: "id",
      label: "ID",
      minWidth: 170,
    },
    {
      id: "talent",
      label: "Talent",
      minWidth: 170,
    },
  ];

  return (
    <>
      <TableComponent
        data={data.data.data.contracts}
        columns={columns}
        rows={rows}
        count={data.data.results}
        page={page}
        handleChangePage={handleChangePage}
        handleUserClick={handleUserClick}
        rowsPerPage={rowsPerPage}
        pT={"UserProfile"}
      />
    </>
  );
};
export default ClientContracts;
