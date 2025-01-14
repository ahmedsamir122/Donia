import { Link, useNavigate } from "react-router-dom";
import classes from "./ForgotPasswordCard.module.css";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { URL, updateFileData } from "../utils/queryFunctions";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/login-slice";
import axios from "axios";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";

const postData = (data) => {
  return axios.patch(`${URL}/api/v1/users/resetPasswordByPhone`, data, {
    withCredentials: true,
  });
};
const ForgotPasswordCard = () => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  const [value, setValue] = useState();
  const [idToken, setIdToken] = useState(null);
  const [errorOtp, setErrorOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptchaVerifierRef = useRef(null); // Use useRef to keep reference

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: async (data) => {
      console.log(data);

      if (
        data.data.data.user.status === "3d" ||
        data.data.data.user.status === "1w" ||
        data.data.data.user.status === "2w" ||
        data.data.data.user.status === "1m" ||
        data.data.data.user.status === "blocked"
      ) {
        dispatch(authActions.login(data.data.data.user));
        localStorage.setItem("token", "blocked");
        navigate("/blocked");
      }
      if (data.data.data.user.status === "pending") {
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
            `+${value}`,
            recaptchaVerifierRef.current
          );
          console.log(confirmationResult);
          setConfirmationResult(confirmationResult);
        } catch (error) {
          console.log(error);
        }
      }
      if (data.data.data.user.status === "active") {
        localStorage.setItem("token", data.data.token);
        dispatch(authActions.login(data.data.data.user));
        dispatch(authActions.getToken(data.data.token));

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 48);
        localStorage.setItem("expiration", expiration.toISOString());
        navigate("/");
      }
      console.log(data.data.data.user);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });
  const {
    register: registerPassword, // Rename to avoid conflict
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm();

  const onsubmit = async (data) => {
    if (!recaptchaVerifierRef.current) {
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
    }

    // Send OTP

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+${value}`,
        recaptchaVerifierRef.current
      );
      console.log(confirmationResult);
      setConfirmationResult(confirmationResult);
    } catch (error) {
      console.log(error);
    }
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
      setIdToken(idToken);
      setShowPassword(true);

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

  const onSubmitPassword = (data) => {
    const [password, passwordConfirm] = getValues([
      "password",
      "passwordConfirm",
    ]);
    mutate({ password, passwordConfirm, phone: value, token: idToken });
  };

  return (
    <div className={classes.main}>
      {!confirmationResult && (
        <div className={classes.card}>
          <div className={classes.title}>
            <Link to="/">Donia</Link>
          </div>

          <form className={classes.form} onSubmit={handleSubmit(onsubmit)}>
            <PhoneInputWithCountry
              international
              countryCallingCodeEditable={false}
              defaultCountry="ID"
              value={value}
              onChange={(phone) => setValue(phone)}
              control={control}
              rules={{ required: true }}
              placeholder="Enter phone number"
              name="phoneInputWithCountrySelect"
              // {...register("username", { required: true })}
            />

            {errors.phoneInputWithCountrySelect?.type === "required" && (
              <p className={classes.error}>please enter your phone number</p>
            )}

            <button className={classes.button}>Next</button>
          </form>
        </div>
      )}
      {confirmationResult && !showPassword && (
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
      {confirmationResult && showPassword && (
        <form
          className={classes.formNewPassword}
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
        >
          {" "}
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
          {/* {errorRes && <p className={classes.error}>{errorRes}</p>} */}
          {error && (
            <p className={classes.error}>{error?.response?.data?.message}</p>
          )}
          <button>Save</button>
        </form>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default ForgotPasswordCard;
