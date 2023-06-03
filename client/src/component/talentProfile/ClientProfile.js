import NavBar from "../navBar/NavBar";
import TalentOne from "./TalentOne";

const ClientProfile = (props) => {
  return (
    <div>
      <NavBar />
      <TalentOne
        onData={props.onData}
        showEdit={props.showEdit}
        ratingsAverage={props.onData.ratingsAverageC}
        ratingsQuantity={props.onData.ratingsQuantityC}
        client={true}
        reviewClient={true}
        username={props.username}
      />
    </div>
  );
};

export default ClientProfile;
