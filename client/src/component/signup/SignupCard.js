import classes from "./SignupCard.module.css";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/login-slice";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import "react-phone-number-input/style.css";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { URL, updateFileData } from "../utils/queryFunctions";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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
  const [otp, setOtp] = useState("");
  const [errorOtp, setErrorOtp] = useState(false);
  // const [enterOtp, setEntrOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const userRed = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null); // Use useRef to keep reference
  const token = useSelector((state) => state.auth.token);

  const countries = Country.getAllCountries();

  const verifyPhone = (data) => {
    console.log("verify");
    return updateFileData(`${URL}/api/v1/users/verifyPhone`, data, token);
  };

  const {
    mutate: mutateRegister,
    isError,
    error,
  } = useMutation(postData, {
    onSuccess: async (data) => {
      console.log(data.data.data);
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified:", response);
          },
          appVerificationDisabledForTesting: true, // Disable for testing
        } // Firebase auth instance
      );

      // Send OTP

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          `+${data.data.data.user.phone}`,
          recaptchaVerifierRef.current
        );
        console.log(confirmationResult);
        setConfirmationResult(confirmationResult);
      } catch (error) {
        console.log(error);
      }
    },
  });
  const {
    mutate,
    isError: isErrorVerify,
    error: errorVerify,
  } = useMutation(verifyPhone, {
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

    // Create user in the backend
    mutateRegister({
      // email,
      password,
      username,
      passwordConfirm,
      country,
      city,
      perform,
      phone,
    });

    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaVerifier.reset(widgetId);
    });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmationResult.confirm(otp);

      // The user signed in successfully
      // alert("User signed in successfully");

      // Get the Firebase ID token
      const idToken = await result.user.getIdToken();

      // Now you have the ID token
      console.log("Firebase Token:", idToken);

      // You can use this token for any server-side verification or authentication
      mutate({ token: idToken });

      // Proceed with the rest of your logic
      console.log(result.user); // Signed-in user info
    } catch (error) {
      setErrorOtp(true);
      console.error("Invalid OTP: ", error);
    }
  };

  const resendOTP = async () => {
    if (!confirmationResult) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified for resend:", response);
          },
          appVerificationDisabledForTesting: true,
        }
      );

      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          `+${value}`, // Use the current phone number value
          recaptchaVerifierRef.current
        );
        console.log("OTP Resent: ", confirmation);
        setConfirmationResult(confirmation); // Store the new confirmation result
      } catch (error) {
        console.log("Error resending OTP:", error);
      }
    }
  };
  console.log(error?.response?.data?.message);
  return (
    <div className={classes.main}>
      {!confirmationResult && (
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
              <p className={classes.error}>
                username should not contain spaces.
              </p>
            )}
            {error?.response?.data?.message.includes("username") && (
              <p className={classes.error}>{error?.response.data.message}</p>
            )}
            {/* <input
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
          )} */}
            <PhoneInputWithCountry
              international
              countryCallingCodeEditable={false}
              defaultCountry="ID"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
              <p className={classes.error}>
                the minimum length of password is 8
              </p>
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
            {error && (
              <p className={classes.error}>{error?.response?.data?.message}</p>
            )}
            <button className={classes.button}>Sign Up</button>
          </form>
        </div>
      )}
      {confirmationResult && (
        <form className={classes.verifyForm} onSubmit={handleVerifyOTP}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button type="button" onClick={resendOTP}>
            resend OTP
          </button>
          <button type="submit">Verify OTP</button>
          {errorOtp && <p className={classes.error}>this otp isn't valid</p>}
        </form>
      )}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default SignupCard;
