import TalentFetch from "./TalentsFetch";
import classes from "./TalentsFetch.module.css";
import Pagination from "@mui/material/Pagination";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FetshingAndPagination = () => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlehange = (e, p) => {
    setPage(p);
  };

  const countHandler = (num) => {
    setCount(num);
    console.log(num);
  };

  useEffect(() => {
    setPage(1); // Reset page to 1 when search parameters change
  }, [searchParams]);

  return (
    <div className={classes.main}>
      <TalentFetch page={page} onCountHandler={countHandler} />
      {count > 20 && (
        <div className={classes.pagination}>
          <Pagination
            count={Math.ceil(count / 20)}
            color="primary"
            onChange={handlehange}
          ></Pagination>
        </div>
      )}
      {count === 0 && <p>no results found</p>}
    </div>
  );
};

export default FetshingAndPagination;
