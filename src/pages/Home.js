import classes from "./Home.module.css";
import background from "../img/Task-Manager.webp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <section className={classes.main}>
      <header className={classes.top}>
        <div className={classes.logo}>
          <Link to="/">Donia</Link>
        </div>
        <div className={classes.login}>
          <Link to="/signin">Log in</Link>
        </div>
      </header>
      <div className={classes.bottom}>
        <img className={classes.img} src={background} alt="" />
        <div className={classes.content}>
          <h2>
            Hire the best <br />
            freelancers for any job,
            <br /> online.
          </h2>
          <ul className={classes.list}>
            <li>World's largest freelance marketplace</li>
            <li>World's largest freelance marketplace</li>
            <li>World's largest freelance marketplace</li>
            <li>World's largest freelance marketplace</li>
          </ul>
          <div className={classes.buttons}>
            <button onClick={() => navigate("/search")}>Hire a talent</button>
            <button onClick={() => navigate("/me")}>A talent</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
