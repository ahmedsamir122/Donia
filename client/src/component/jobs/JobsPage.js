import NavBar from "../navBar/NavBar";
import React from "react";
import JobsContent from "./JobsContent";
const JobsPage = () => {
  return (
    <React.Fragment>
      <NavBar />
      <section className="container">
        <JobsContent />
      </section>
    </React.Fragment>
  );
};

export default JobsPage;
