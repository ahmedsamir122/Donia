import classes from "./Type.module.css";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateFileData, URL } from "../utils/queryFunctions";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const Type = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const [checkValue, setCheckValue] = useState(user?.perform);
  const token = useSelector((state) => state.auth.token);
  const [enable, setEnable] = useState(true);

  const optionsLabel = [
    { value: "talent", label: "Talent" },
    { value: "client", label: "Client" },
  ];

  useEffect(() => {
    setCheckValue(user.perform);
  }, [user]);

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

  const onsubmit = async (data) => {
    console.log(data);
    const [perform] = getValues(["checkBox"]);
    mutate({ perform });
  };

  console.log(checkValue);
  return (
    <div className={classes.main}>
      <p className={classes.title}>Account type</p>
      {enable && (
        <form
          className={classes.CheckboxTotalCon}
          onSubmit={handleSubmit(onsubmit)}
        >
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
        </form>
      )}
      {enable && (
        <p className={classes.button} onClick={onsubmit}>
          Save Changes
        </p>
      )}
      {!enable && <p className={classes.button}>Your changes has been saved</p>}
    </div>
  );
};

export default Type;
