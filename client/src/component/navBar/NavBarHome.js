import classes from "./NavBarHome.module.css";
import { Link } from "react-router-dom";
const NavBarHome = () => {
  return (
    <div className="container">
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
    </div>
  );
};

export default NavBarHome;
