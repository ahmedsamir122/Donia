import { useState } from "react";
import classes from "./PhoneNumber.module.css";
import PhoneInput from "react-phone-number-input";
import { useForm } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";

const PhoneNumber = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [enable, setEnable] = useState(false);
  const queryClient = useQueryClient();

  const updateMyProfile = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };

  const { mutate, isError, error } = useMutation(updateMyProfile, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      setEnable(false);
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
  const [value, setValue] = useState();

  const onsubmit = async (data) => {
    console.log(data);

    const [phone] = getValues(["phoneInputWithCountrySelect"]);
    mutate({ phone });
  };

  return (
    <div className={classes.main}>
      <p className={classes.title}>Phone number</p>
      {!enable && <div>{`+${user.phone}`}</div>}
      {enable && (
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className={classes.inputCon}>
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
            />
            {errors.phoneInputWithCountrySelect?.type === "required" && (
              <p className={classes.error}>please enter your phone number</p>
            )}
          </div>
          {enable && <button className={classes.button}>Add new number</button>}
        </form>
      )}
      {!enable && (
        <button
          type="button"
          onClick={() => setEnable(true)}
          className={classes.button}
        >
          Change your phone number
        </button>
      )}
    </div>
  );
};

export default PhoneNumber;
