import classes from "./SignupCard.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const SignupCard = () => {
  return (
    <div className={classes.main}>
      <div className={classes.card}>
        <h3>
          <Link to="/">Donia</Link>
        </h3>
        <h3>Sign Up</h3>
        <div className={classes.google}>
          <FcGoogle className={classes.googlelogo} />
          <div>Continue with Google</div>
        </div>
        <div className={classes.line}>
          <div className={classes.or}>or</div>
        </div>
        <form className={classes.form}>
          <input
            type="text"
            placeholder="Enter your name..."
            className={classes.input}
          />
          <input
            type="email"
            placeholder="Enter your email..."
            className={classes.input}
          />
          <input
            type="number"
            placeholder="Enter your phone number..."
            className={classes.input}
          />
          <input
            type="password"
            placeholder="Password..."
            className={classes.input}
          />
          <input
            type="password"
            placeholder="Confirm Password..."
            className={classes.input}
          />
          {/* <input type="checkbox" id="terms" className={classes.terms} />
          <label for="terms">
            I accept the Terms of Service and Privacy Policy
          </label> */}
          <label>
            <input type="checkbox" name="html" value="html" /> I accept the
            Terms of Service and Privacy Policy
          </label>
          <button className={classes.button}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupCard;
