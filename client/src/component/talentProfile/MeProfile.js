import NavBar from "../navBar/NavBar";
import TalentOne from "./TalentOne";
import { useSelector } from "react-redux";
import { useState } from "react";
const MeProfile = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [rate, setRate] = useState({
    ratingsAverage: user.ratingsAverageF,
    ratingsQuantity: user.ratingsQuantityF,
  });

  const rateFreelancerHandler = () => {
    setRate({
      ratingsAverage: user.ratingsAverageF,
      ratingsQuantity: user.ratingsQuantityF,
    });
  };
  const rateClientHandler = () => {
    setRate({
      ratingsAverage: user.ratingsAverageC,
      ratingsQuantity: user.ratingsQuantityC,
    });
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
        onRateFreelancer={rateFreelancerHandler}
        onRateClient={rateClientHandler}
      />
    </div>
  );
};

export default MeProfile;
