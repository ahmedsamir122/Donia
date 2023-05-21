import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import classes from "./ContractsTable.module.css";

let x = "offer";
let y = "active";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 280,
    renderCell: (params) => {
      return (
        <Link to="/contracts/2" className={classes.contractName}>
          Post a story in your instagram
        </Link>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 180,
    renderCell: (params) => {
      return <p className={`${classes[x]}`}>{x}</p>;
    },
  },
  { field: "date", headerName: "Date", width: 180 },
  {
    field: "client",
    headerName: "Client Name",
    width: 150,
    renderCell: (params) => {
      return (
        <Link to="/u/abo1334" className={classes.contractName}>
          Jonas123
        </Link>
      );
    },
  },
  // {
  //   field: "chat",
  //   headerName: "Chat",
  //   width: 90,
  // },
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

const rows = [
  {
    id: 1,
    name: "Zaki",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 2,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 3,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 4,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 5,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 6,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 7,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 8,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
  {
    id: 9,
    name: "Snow",
    status: "offer",
    date: "02-10-2023",
    client: "ahmed",
    chat: "",
  },
];

export default function DataTable(props) {
  return (
    <div
      style={{ height: 600, width: "100%", backgroundColor: "white" }}
      className={classes.tableCon}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
