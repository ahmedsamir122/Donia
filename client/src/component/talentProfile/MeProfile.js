import NavBar from "../navBar/NavBar";
import TalentOne from "./TalentOne";
import { useSelector } from "react-redux";
import { useState } from "react";
const MeProfile = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [reviewPublicClient, setReviewPublicClient] = useState(false);
  const [rate, setRate] = useState({
    ratingsAverage: user.ratingsAverageF,
    ratingsQuantity: user.ratingsQuantityF,
  });

  const rateFreelancerHandler = () => {
    setRate({
      ratingsAverage: user.ratingsAverageF,
      ratingsQuantity: user.ratingsQuantityF,
    });
    setReviewPublicClient(false);
  };
  const rateClientHandler = () => {
    setRate({
      ratingsAverage: user.ratingsAverageC,
      ratingsQuantity: user.ratingsQuantityC,
    });
    setReviewPublicClient(true);
  };
  return (
    <div>
      <NavBar />
      <TalentOne
        onData={user}
        showEdit={props.showEdit}
        ratingsAverage={rate.ratingsAverage}
        ratingsQuantity={rate.ratingsQuantity}
        client={user.perform === "talent" ? false : true}
        username={user.username}
        onRateFreelancer={rateFreelancerHandler}
        onRateClient={rateClientHandler}
        reviewClient={reviewPublicClient}
      />
    </div>
  );
};

export default MeProfile;
