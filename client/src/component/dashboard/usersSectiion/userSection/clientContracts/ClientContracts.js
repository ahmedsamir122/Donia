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
  const navigate = useNavigate();

  const fetchClientContracts = () => {
    return axios.get(`${URL}/api/v1/contracts/public-contractsC/${username}`);
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "client",
    fetchClientContracts,
    { refetchOnWindowFocus: false }
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleUserClick = (id) => {
    navigate(`/dashboard/contracts/${id}`);
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.data.data.contracts.map((user) =>
          createData(user.id, user.freelancer.username)
        )
      );
      console.log(rows);
    }

    refetch();
  }, [url, page, refetch, data?.data.results]);

  if (isLoading) {
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
      />
    </>
  );
};
export default ClientContracts;
