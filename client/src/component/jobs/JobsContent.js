import classes from "./JobsContent.module.css";
import JobsFreelancer from "./JobsFreelancer";
import { useState } from "react";
const JobsContent = () => {
  const [showClient, setShowClient] = useState(false);
  const [showtalent, setShowtalent] = useState(true);

  const showClientHandler = () => {
    setShowtalent(false);
    setShowClient(true);
  };

  const showtalentHandler = () => {
    setShowClient(false);
    setShowtalent(true);
  };
  return (
    <div>
      <div className={classes.top}>
        <h2>Jobs</h2>
        <div className={classes.type}>
          <div
            className={`${classes.talent} ${showClient && classes.active}`}
            onClick={showClientHandler}
          >
            As client
          </div>
          <div
            className={`${classes.talent} ${showtalent && classes.active}`}
            onClick={showtalentHandler}
          >
            As freelancer
          </div>
        </div>
      </div>
      {showClient && <JobsFreelancer />}
      {showtalent && <JobsFreelancer />}
    </div>
  );
};

export default JobsContent;
