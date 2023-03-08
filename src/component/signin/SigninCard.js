import classes from "./SigninCard.module.css";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SigninCard = () => {
  return (
    <div className={classes.main}>
      <div className={classes.card}>
        <div className={classes.title}>
          <Link to="/">Donia</Link>
        </div>
        <div className={classes.google}>
          <div>log in with</div>
          <div>
            <Link>
              <FcGoogle className={classes.logo} />
            </Link>
          </div>
        </div>
        <div className={classes.line}>
          <div className={classes.or}>or</div>
        </div>
        <form className={classes.form}>
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <div className={classes.forget}>Forgetten passowrd</div>
          <button className={classes.button}>Log in</button>
        </form>

        {/* <div className={classes.newAccount}>Create new account</div> */}
        <div>
          Don't have an account ?<Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SigninCard;
