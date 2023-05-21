import { useState } from "react";
import classes from "./Password.module.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";
import { authActions } from "../../store/login-slice";
import { useDispatch } from "react-redux";

const Password = () => {
  const [enable, setEnable] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const updateMyProfile = (data) => {
    return updateFileData(`${URL}/api/v1/users/updatePassword`, data, token);
  };

  const { mutate, isError, error } = useMutation(updateMyProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      localStorage.setItem("token", data.data.token); // Update token in localStorage
      dispatch(authActions.getToken(data.data.token));
      setEnable(false);
      console.log(data);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
  });

  const onsubmit = async (data) => {
    console.log(data);
    const [currentPassword, password, passwordConfirm] = getValues([
      "currentpassword",
      "password",
      "passwordConfirm",
    ]);
    mutate({ currentPassword, password, passwordConfirm });
  };

  return (
    <div className={classes.main}>
      <p className={classes.title}>Password Settings</p>
      {enable && (
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className={classes.inputCon}>
            <label className={classes.label}>Current password</label>
            <input
              placeholder="Current Password..."
              className={classes.input}
              type="password"
              {...register("currentpassword", { required: true })}
            />
            {errors.currentpassword?.type === "required" && (
              <p className={classes.error}>please enter your password</p>
            )}
          </div>
          <div className={classes.inputCon}>
            <label className={classes.label}>New password</label>
            <input
              placeholder="New Password..."
              className={classes.input}
              {...register("password", { required: true })}
              type="password"
            />
            {errors.password?.type === "required" && (
              <p className={classes.error}>please enter your password</p>
            )}
          </div>
          <div className={classes.inputCon}>
            <label className={classes.label}>Confirm password</label>
            <input
              placeholder="Confirm Password..."
              className={classes.input}
              type="password"
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
          </div>

          <button className={classes.button}>Save</button>
        </form>
      )}
      {!enable && <div>your password has changed</div>}
    </div>
  );
};

export default Password;
