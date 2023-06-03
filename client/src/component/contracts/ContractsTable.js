import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import classes from "./ContractsTable.module.css";
import dateFormat from "dateformat";

let x = "offer";
let y = "active";

export default function DataTable(props) {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      renderCell: (params) => {
        return (
          <Link
            to={`/contracts/${params.value.id}`}
            className={classes.contractName}
          >
            {params.value.name}
          </Link>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return <p className={`${classes[x]}`}>{params.value}</p>;
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      renderCell: (params) => {
        return (
          <p className={classes.contractName}>
            {dateFormat(params.value, " mmmm dS, yyyy")}
          </p>
        );
      },
    },
    {
      field: "client",
      headerName: "with",
      width: 200,
      renderCell: (params) => {
        return (
          <Link
            to={props.client ? `/${params.value}` : `/u/${params.value}`}
            className={classes.contractName}
          >
            {params.value}
          </Link>
        );
      },
    },
    {
      field: "chat",
      headerName: "Chat",
      sortable: false,
      width: 130,
      renderCell: (params) => {
        return (
          <Link className={classes.chatCon}>
            <div
              className={`${classes.chatPoint} ${
                y === "active" && classes.active
              }`}
            ></div>
            <p className={classes.chat}>Chat</p>
          </Link>
        );
      },
    },
  ];

  const data = props.onData?.map((item) => ({
    id: item.id,
    name: { name: item.name, id: item.id },
    status: item.activity,
    date: item.createdAt,
    client: props.client ? item.freelancer.username : item.client.username,
  }));
  console.log(data);
  return (
    <div
      style={{ height: 600, width: "100%", backgroundColor: "white" }}
      className={classes.tableCon}
    >
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
