import HalfRating from "../rating/Rate";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import classes from "./Filter.module.css";
import ComboBox from "../inputSelect/InputSelect";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
const Filter = (props) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [filterRate, setFilterRate] = useState([]);
  const [filterReviews, setFilterReviews] = useState([]);
  const queryRedux = useSelector((state) => state.query.query);

  const filterArray = (check, input, prev) => {
    if (check) {
      return [...prev, input];
    } else {
      const newArray = [...prev];
      const item = newArray.find((el) => el === input);
      return newArray.filter((el) => el !== item);
    }
  };

  const filterRateHandler = (e) => {
    setFilterRate((previous) => {
      return filterArray(e.target.checked, e.target.value, previous);
    });
  };

  const filterReviewsHandler = (e) => {
    setFilterReviews((previous) => {
      return filterArray(e.target.checked, e.target.value, previous);
    });
  };

  useEffect(() => {
    const query = {
      q: queryRedux,
      rate: filterRate.join(","),
      reviews: filterReviews.join(","),
    };
    Object.keys(query).forEach((el) => {
      if (query[el] === "") {
        delete query[el];
      }
      setSearchParams(query);
    });
  }, [filterRate, setSearchParams, filterReviews]);

  useEffect(() => {
    if (searchParams.get("rate") || searchParams.get("reviews")) {
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("0")
                : false
            }
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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("1")
                : false
            }
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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("2")
                : false
            }
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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("3")
                : false
            }
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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("4")
                : false
            }
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
            onClick={filterRateHandler}
            defaultChecked={
              searchParams.has("rate")
                ? searchParams.get("rate").includes("5")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("0-4")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("5-9")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("10-14")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("15-19")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("20-49")
                : false
            }
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
            onClick={filterReviewsHandler}
            defaultChecked={
              searchParams.has("reviews")
                ? searchParams.get("reviews").includes("50-")
                : false
            }
          />
          <label htmlFor="above" className={classes.label}>
            More than 50{" "}
          </label>
        </div>
      </div>
      <div className={classes.filterCon}>
        <div className={classes.filterTop}>
          <h2 className={classes.filterName}>City</h2>
          <h2 className={classes.filterClear}>clear</h2>
        </div>
        <div className={classes.filterBottom}>
          <ComboBox />
        </div>
      </div>
      <div className={classes.filterButton}>
        <button>See results</button>
      </div>
    </div>
  );
};

export default Filter;
