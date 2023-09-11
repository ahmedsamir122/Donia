import classes from "./SigninCard.module.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/login-slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { URL } from "../utils/queryFunctions";

const postData = (data) => {
  return axios.post(`${URL}/api/v1/users/signin`, data, {
    withCredentials: true,
  });
};

const SigninCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data.token);
      localStorage.setItem("token", data.data.token);
      // dispatch(authActions.login(data.data.data.user));
      dispatch(authActions.getToken(data.data.token));
      navigate("/");
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    console.log(error);
    const [email, password] = getValues(["email", "password"]);

    mutate({ email, password });
  };

  return (
    <div className={classes.main}>
      <div className={classes.card}>
        <div className={classes.title}>
          <Link to="/">Donia</Link>
        </div>

        <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: true })}
          />
          {errors.email?.type === "required" && (
            <p className={classes.error}>please enter your email address</p>
          )}
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password?.type === "required" && (
            <p className={classes.error}>please enter your password</p>
          )}
          <div className={classes.forget}>Forgetten passowrd?</div>
          {isError && (
            <p className={classes.error}>{error.response.data.message}</p>
          )}
          <button className={classes.button}>Log in</button>
        </form>

        <div>
          <span className={classes.ask}>Don't have an account ?&nbsp;</span>
          <Link className={classes.askLink} to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninCard;
