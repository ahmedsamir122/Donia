import classes from "./General.module.css";
import { useState } from "react";
import { Country, State } from "country-state-city";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";

const General = () => {
  const [enable, setEnable] = useState(true);
  const [states, setStates] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const countries = Country.getAllCountries();

  const updateMyProfile = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };

  const chooseStateHandler = (e) => {
    const countryOne = countries.find((el) => el.name === e.target.value);
    setStates(State.getStatesOfCountry(countryOne.isoCode));
  };

  const { mutate, isError, error } = useMutation(updateMyProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      setEnable(true);
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
    defaultValues: {
      username: user?.username,
      email: user?.email,
      countryName: user?.country,
      state: user?.city,
    },
  });

  const onsubmit = async (data) => {
    console.log(data);
    const [username, email, country, city] = getValues([
      "username",
      "email",
      "countryName",
      "state",
    ]);
    mutate({ username, email, country, city });
  };

  return (
    <div className={classes.main}>
      <p className={classes.title}>Profile Details</p>
      <form onSubmit={handleSubmit(onsubmit)}>
        <div className={classes.inputCon}>
          <label className={classes.label}>username</label>
          <input
            defaultValue="Small"
            disabled={enable}
            className={classes.input}
            control={control}
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" && (
            <p className={classes.error}>please enter your username</p>
          )}
        </div>
        <div className={classes.inputCon}>
          <label className={classes.label}>email</label>
          <input
            defaultValue="Small"
            disabled={enable}
            className={classes.input}
            {...register("email", { required: true })}
          />
          {errors.email?.type === "required" && (
            <p className={classes.error}>please enter your email address</p>
          )}
        </div>
        <div className={classes.inputCon}>
          <label className={classes.label}>Country</label>

          <select
            className={classes.input}
            onInput={chooseStateHandler}
            defaultValue={"Indonesia"}
            disabled={enable}
            {...register("countryName", { required: true })}
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
        </div>
        <div className={classes.inputCon}>
          <label className={classes.label}>State</label>

          <select
            className={classes.input}
            defaultValue={states[0]}
            disabled={enable}
            {...register("state", { required: true })}
          >
            <option value="DKI Jakarta">{"DKI Jakarta"}</option>
            {states.map((c, i) => (
              <option key={i} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.state?.type === "required" && (
            <p className={classes.error}>please enter your state name</p>
          )}
        </div>
        {!enable && <button className={classes.button}>Save changes</button>}
      </form>
      {enable && (
        <button className={classes.button} onClick={() => setEnable(false)}>
          Request to change
        </button>
      )}
    </div>
  );
};

export default General;
