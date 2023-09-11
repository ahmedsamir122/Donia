import classes from "./HomePage.module.css";
import background from "../../img/business_management_consulting_services_1_.58befa291d7eb.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <section className={classes.main}>
      {/* <div className="container">
        <header className={classes.top}>
          <div>
            <Link className={classes.logo} to="/">
              Donia
            </Link>
          </div>
          <div>
            <Link className={classes.login} to="/signin">
              Log in
            </Link>
          </div>
        </header>
      </div> */}

      <div className={classes.bottom}>
        <img className={classes.img} src={background} alt="" />
        <div className={classes.content}>
          <h2 className={classes.title}>
            Hire the best <br />
            freelancers for any job,
            <br /> online.
          </h2>
          <ul className={classes.list}>
            <li className={classes.listDetail}>
              With us you will be paid on time
            </li>
            <li className={classes.listDetail}>With us no more scammers</li>
            <li className={classes.listDetail}>
              With us you will have your own privacy
            </li>
            <li className={classes.listDetail}>
              With us no more private messages
            </li>
          </ul>
          <div className={classes.buttons}>
            <button onClick={() => navigate("/search")}>Hire a talent</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
