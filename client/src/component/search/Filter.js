import HalfRating from "../rating/Rate";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import classes from "./Filter.module.css";
import ComboBox from "../inputSelect/InputSelect";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useLocation } from "react-router-dom";

const Filter = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [filterRate, setFilterRate] = useState([]);
  const [filterReviews, setFilterReviews] = useState([]);
  const queryRedux = useSelector((state) => state.query.query);
  const navigate = useNavigate();
  const location = useLocation();

  const filterRateHandler = (e) => {
    if (e.target.checked) {
      setFilterRate((prev) => {
        return [...prev, e.target.value];
      });
    } else {
      setFilterRate((prev) => {
        const item = filterRate.find((el) => e.target.value === el);
        return [...filterRate.filter((el) => el !== item)];
      });
    }
  };

  const filterReviewsHandler = (e) => {
    if (e.target.checked) {
      setFilterReviews((prev) => {
        return [...prev, e.target.value];
      });
    } else {
      setFilterReviews((prev) => {
        const item = filterReviews.find((el) => e.target.value === el);
        return [...filterReviews.filter((el) => el !== item)];
      });
    }
  };

  console.log(location.search);

  useEffect(() => {
    const query = {
      q: queryRedux,
      rate: filterRate.join(","),
      reviews: filterReviews.join(","),
    };

    // Remove empty query parameters
    Object.keys(query).forEach((el) => {
      if (query[el] === "") {
        delete query[el];
      }
    });

    // Update the URL using the navigate function

    // navigate(
    //   // "/",
    //   {
    //     search: new URLSearchParams(query).toString(),
    //   },
    //   { replace: true }
    // );
    const newsSearchParams = new URLSearchParams(query).toString();
    navigate(`/search?${newsSearchParams}`);

    console.log(query);
  }, [filterRate, filterReviews, queryRedux, navigate]);

  useEffect(() => {
    const rate = searchParams.get("rate");
    const reviews = searchParams.get("reviews");
    console.log(searchParams.get("rate")?.split(","));

    if (rate !== null) {
      setFilterRate(rate.split(","));
    }
    if (reviews !== null) {
      setFilterReviews(reviews.split(","));
    }
    if (rate === null) {
      setFilterRate([]);
    }
    if (reviews === null) {
      setFilterReviews([]);
    }
  }, [location.search, searchParams]);

  console.log(filterRate?.includes("0"));
  console.log(location);

  return (
    <div className={classes.main}>
      <div className={classes.topTitle}>
        <div className={classes.arrowLeft}>
          <KeyboardArrowLeftOutlinedIcon onClick={props.onFilter} />
        </div>
        <h2 className={classes.title}>Filters</h2>
      </div>
      <div className={classes.filterCon}>
        <div className={classes.filterTop}>
          <h2 className={classes.filterName}>Rating</h2>
          <h2 className={classes.filterClear}>clear</h2>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            id="zero"
            value="0"
            onChange={filterRateHandler}
            checked={filterRate?.includes("0")}
            readOnly
          />
          <label htmlFor="zero">
            <HalfRating value={0} />{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="1"
            id="one"
            onChange={filterRateHandler}
            checked={filterRate?.includes("1")}
            readOnly
          />
          <label htmlFor="one">
            <HalfRating value={1} />{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            id="two"
            value="2"
            onChange={filterRateHandler}
            checked={filterRate?.includes("2")}
            readOnly
          />
          <label htmlFor="two">
            <HalfRating value={2} />{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            id="three"
            value="3"
            onChange={filterRateHandler}
            checked={filterRate?.includes("3")}
            readOnly
          />
          <label htmlFor="three">
            <HalfRating value={3} />{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            id="four"
            value="4"
            onChange={filterRateHandler}
            checked={filterRate?.includes("4")}
            readOnly
          />
          <label htmlFor="four">
            <HalfRating value={4} />{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            id="five"
            value="5"
            onChange={filterRateHandler}
            checked={filterRate?.includes("5")}
            readOnly
          />
          <label htmlFor="five">
            <HalfRating value={5} />{" "}
          </label>
        </div>
      </div>
      <div className={classes.filterCon}>
        <div className={classes.filterTop}>
          <h2 className={classes.filterName}>Reviews</h2>
          <h2 className={classes.filterClear}>clear</h2>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="0-4"
            id="five"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("0-4")}
            readOnly
          />
          <label htmlFor="five" className={classes.label}>
            Less than 5
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="5-9"
            id="ten"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("5-9")}
            readOnly
          />
          <label htmlFor="ten" className={classes.label}>
            5 to 10
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="10-14"
            id="fifteen"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("10-14")}
            readOnly
          />
          <label htmlFor="fifteen" className={classes.label}>
            10 to 15{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="15-19"
            id="twenty"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("15-19")}
            readOnly
          />
          <label htmlFor="twenty" className={classes.label}>
            15 to 20{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="20-49"
            id="fifty"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("20-49")}
            readOnly
          />
          <label htmlFor="fifty" className={classes.label}>
            20 to 50{" "}
          </label>
        </div>
        <div className={classes.filterBottom}>
          <input
            type="checkbox"
            value="50-"
            id="above"
            onChange={filterReviewsHandler}
            checked={filterReviews?.includes("50-")}
            readOnly
          />
          <label htmlFor="above" className={classes.label}>
            More than 50{" "}
          </label>
        </div>
      </div>
      {/* <div className={classes.filterCon}>
        <div className={classes.filterTop}>
          <h2 className={classes.filterName}>City</h2>
          <h2 className={classes.filterClear}>clear</h2>
        </div>
        <div className={classes.filterBottom}>
          <ComboBox />
        </div>
      </div> */}
      <div className={classes.filterButton}>
        <button>See results</button>
      </div>
    </div>
  );
};

export default Filter;
