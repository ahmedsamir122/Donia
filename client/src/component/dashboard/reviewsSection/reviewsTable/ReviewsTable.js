import * as React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { URL } from "../../../utils/queryFunctions";
import Loading from "../../../loading/Loading";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TableComponent from "../../tableComponent/TableComponent";
import { useSelector } from "react-redux";
import classes from "./ReviewsTable.module.css";

const ReviewsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = useState([]);
  const [url, setUrl] = useState("");
  const [reviews, setReviews] = useState("reviewCs");
  const [reviewsBtn, setReviewsBtn] = useState("Clients");
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const tokenLocal = localStorage.getItem("token") || "";

  const fetchContacts = () => {
    return axios.get(`${URL}/api/v1/${reviews}`, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "reviews",
    fetchContacts,
    { refetchOnWindowFocus: false }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (data && data.data && data.data.data && data.data.data[reviews]) {
      setRows(
        data.data.data[reviews].map((review) =>
          createData(
            review.id,
            review.review,
            review.rating,
            review.client,
            review.freelancer,
            review.contract
          )
        )
      );
    }

    refetch();
  }, [url, page, refetch, data?.data.results, reviews]);

  function createData(id, review, rating, client, freelancer, contract) {
    return { id, review, rating, client, freelancer, contract };
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
    { id: "review", label: "Review", minWidth: 170 },
    {
      id: "rating",
      label: "Rating",
      minWidth: 170,
    },
    {
      id: "client",
      label: "Client",
      minWidth: 170,
    },
    {
      id: "freelancer",
      label: "Freelancer",
      minWidth: 170,
    },
    {
      id: "contract",
      label: "Contract",
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
  const handleReviewsClick = () => {
    reviews === "reviewCs" ? setReviews("reviewFs") : setReviews("reviewCs");
    reviews === "reviewCs"
      ? setReviewsBtn("Talents")
      : setReviewsBtn("Clients");
  };

  return (
    <div className={classes.container}>
      <Outlet />
      <div className={classes.header}>
        <h2>Reviews</h2>
        {isFetching ? (
          "Loading.."
        ) : (
          <button onClick={handleReviewsClick} className={classes.switchBtn}>
            {reviewsBtn} Reviews
          </button>
        )}
        <div>
          <SearchOutlinedIcon className={classes.search} />
          <input
            type="text"
            placeholder="Search For Review"
            onKeyPress={handleKeyPress}
          ></input>
        </div>
      </div>
      {
        <TableComponent
          columns={columns}
          rows={rows}
          count={data.data.results}
          page={page}
          handleChangePage={handleChangePage}
          handleUserClick={handleUserClick}
          pT={"Reviews"}
        />
      }
    </div>
  );
};
export default ReviewsTable;
