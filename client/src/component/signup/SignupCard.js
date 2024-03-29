import classes from "./SignupCard.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/login-slice";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import "react-phone-number-input/style.css";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { URL } from "../utils/queryFunctions";

const postData = (data) => {
  return axios.post(`${URL}/api/v1/users/signup`, data, {
    withCredentials: true,
  });
};
const SignupCard = () => {
  const [errorRes, setErrorRes] = useState(false);
  const [states, setStates] = useState([]);
  const [checkValue, setCheckValue] = useState("talent");
  const [value, setValue] = useState();
  const userRed = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countries = Country.getAllCountries();

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      console.log(data.data.data.user, data.data.token);
      localStorage.setItem("token", data.data.token);
      dispatch(authActions.login(data.data.data.user));
      dispatch(authActions.getToken(data.data.token));
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 48);
      localStorage.setItem("expiration", expiration.toISOString());
      navigate("/");
    },
  });

  const chooseStateHandler = (e) => {
    const countryOne = countries.find((el) => el.name === e.target.value);
    setStates(State.getStatesOfCountry(countryOne.isoCode));
  };

  const optionsLabel = [
    { value: "talent", label: "Talent" },
    { value: "client", label: "Client" },
  ];
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const onsubmit = async (data) => {
    console.log(data);
    const [
      email,
      password,
      username,
      passwordConfirm,
      country,
      city,
      perform,
      phone,
    ] = getValues([
      "email",
      "password",
      "username",
      "passwordConfirm",
      "countryName",
      "state",
      "checkBox",
      "phoneInputWithCountrySelect",
    ]);

    mutate({
      email,
      password,
      username,
      passwordConfirm,
      country,
      city,
      perform,
      phone,
    });
  };
  console.log(error?.response?.data?.message);
  return (
    <div className={classes.main}>
      <div className={classes.card}>
        <h3>
          <Link to="/">Donia</Link>
        </h3>
        <h3>Sign Up</h3>
        <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
          <div className={classes.CheckboxTotalCon}>
            {optionsLabel.map((item, i) => {
              return (
                <label
                  className={classes.CheckboxCon}
                  htmlFor={item.label}
                  key={i}
                >
                  <input
                    {...register("checkBox")}
                    value={item.value}
                    className={classes.Checkbox}
                    type="radio"
                    id={item.label}
                    onChange={(e) => setCheckValue(e.target.value)}
                    checked={checkValue === item.value}
                  />
                  <div className={classes.labelName}>{item.label}</div>
                </label>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Enter your username..."
            className={classes.input}
            {...register("username", {
              required: true,
              validate: (value) => !value.includes(" "),
            })}
          />
          {errors.username?.type === "required" && (
            <p className={classes.error}>please enter your username</p>
          )}
          {errors.username && (
            <p className={classes.error}>username should not contain spaces.</p>
          )}
          {error?.response?.data?.message.includes("username") && (
            <p className={classes.error}>{error?.response.data.message}</p>
          )}
          <input
            type="email"
            placeholder="Enter your email..."
            className={classes.input}
            {...register("email", {
              required: true,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email?.type === "required" && (
            <p className={classes.error}>please enter your email address</p>
          )}
          {errors.email?.type === "pattern" && (
            <p className={classes.error}>{errors.email?.message}</p>
          )}
          {error?.response?.data?.message.includes("email") && (
            <p className={classes.error}>{error?.response.data.message}</p>
          )}
          <PhoneInputWithCountry
            international
            countryCallingCodeEditable={false}
            defaultCountry="ID"
            value={value}
            onChange={setValue}
            control={control}
            rules={{ required: true }}
            placeholder="Enter phone number"
            name="phoneInputWithCountrySelect"
            // {...register("username", { required: true })}
          />

          {errors.phoneInputWithCountrySelect?.type === "required" && (
            <p className={classes.error}>please enter your phone number</p>
          )}
          <select
            className={classes.selectCountry}
            {...register("countryName", { required: true })}
            onInput={chooseStateHandler}
          >
            <option value="">----Country----</option>
            {countries.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.countryName?.type === "required" && (
            <p className={classes.error}>please enter your country name</p>
          )}
          <select
            className={classes.selectState}
            {...register("state", { required: true })}
          >
            <option value="">----State----</option>
            {states.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.state?.type === "required" && (
            <p className={classes.error}>please enter your state name</p>
          )}
          <input
            type="password"
            placeholder="Password..."
            className={classes.input}
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password?.type === "required" && (
            <p className={classes.error}>please enter your password</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className={classes.error}>the minimum length of password is 8</p>
          )}
          <input
            type="password"
            placeholder="Confirm Password..."
            className={classes.input}
            {...register("passwordConfirm", {
              required: true,
              validate: (value) => {
                if (value === getValues("password")) {
                  return true;
                } else {
                  return false;
                }
              },
            })}
          />
          {errors.passwordConfirm?.type === "required" && (
            <p className={classes.error}>please enter your password</p>
          )}
          {errors.passwordConfirm?.type === "validate" && (
            <p className={classes.error}>It doesn't match with password</p>
          )}
          {errorRes && <p className={classes.error}>{errorRes}</p>}
          <button className={classes.button}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupCard;
