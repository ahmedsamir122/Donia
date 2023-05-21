import NavBar from "../navBar/NavBar";
import TalentOne from "./TalentOne";
const TalentProfile = (props) => {
  console.log(props.username);

  return (
    <div>
      <NavBar />
      <TalentOne
        onData={props.onData}
        showEdit={props.showEdit}
        ratingsAverage={props.onData.ratingsAverageF}
        ratingsQuantity={props.onData.ratingsQuantityF}
        client={false}
      />
    </div>
  );
};

export default TalentProfile;
