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
import classes from "../usersSectiion/usersTable/UsersTable.module.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { URL } from "../../utils/queryFunctions";
import Loading from "../../loading/Loading";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const TableComponent = (props) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const columns = props.columns;

  return (
    <div className={classes.container}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.columns.map((column) => {
                  return <TableCell>{column.label}</TableCell>;
                })}
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rows.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.username}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <VisibilityIcon
                        className={classes.view}
                        onClick={() =>
                          props.handleUserClick(
                            row.username || row.id || row.complainerAbout
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[-1]}
          component="div"
          count={props.count}
          rowsPerPage={props.rowsPerPage}
          page={props.page}
          onPageChange={props.handleChangePage}
        />
      </Paper>
    </div>
  );
};
export default TableComponent;
