import NavBar from "../navBar/NavBar";
import TalentOne from "./TalentOne";
const TalentProfile = (props) => {
  return (
    <div>
      <NavBar />
      <TalentOne
        onData={props.onData}
        showEdit={props.showEdit}
        ratingsAverage={props.onData.ratingsAverageF}
        ratingsQuantity={props.onData.ratingsQuantityF}
        client={false}
        reviewClient={false}
        username={props.username}
      />
    </div>
  );
};

export default TalentProfile;
