import ReviewBoth from "./ReviewBoth";
import classes from "./ReviewsTalentOne.module.css";
import { useQuery } from "react-query";
import { URL } from "../utils/queryFunctions";
import axios from "axios";

const ReviewsTalentOne = (props) => {
  const fetchTalents = () => {
    return axios.get(
      `${URL}/api/v1/contracts/${
        props.client ? "public-contractsC" : "public-contractsF"
      }/${props.username}`
    );
  };

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    `${props.client ? "public-contractsC" : "public-contractsF"}`,
    fetchTalents,
    {
      refetchOnWindowFocus: false,
    }
  );

  const reviewsArray = data?.data.data.contracts.filter(
    (item) => item.reviewCs.length > 0 || item.reviewFs.length > 0
  );

  return (
    <div className={classes.reviews}>
      <h2 className={classes.reviewsTitle}>Reviews</h2>
      {reviewsArray?.length > 0 && (
        <ReviewBoth client={props.client} reviews={reviewsArray} />
      )}
      {reviewsArray?.length === 0 && <p>no reviews</p>}
    </div>
  );
};

export default ReviewsTalentOne;
