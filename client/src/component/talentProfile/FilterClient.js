import { useState } from "react";
import classes from "./FilterClient.module.css";
import { Country, State, City } from "country-state-city";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { updateFileData, URL } from "../utils/queryFunctions";

const FilterClient = (props) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();
  console.log(token);
  const postData = (data) => {
    return updateFileData(`${URL}/api/v1/users/updateMe`, data, token);
  };
  const [filterInput, setFilterInput] = useState([
    "filterLocation",
    "filterMinimumAverageRate",
    "filterMinimumReviews",
    "filterMinimumBudget",
  ]);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onSubmit" });

  const { mutate, isError, error } = useMutation(postData, {
    onSuccess: (data) => {
      queryClient.setQueryData("myProfil", (oldData) => {
        return {
          ...data,
        };
      });
      props.onClick();
    },
  });
  const states = State.getStatesOfCountry("ID");
  console.log(states);

  const filterNameHandler = (e) => {
    setFilterName(e.target.value);
    console.log(e.target.name);
    console.log("test");
  };

  const filterValueHandler = (e) => {
    setFilterValue(e.target.value);
  };

  const onsubmit = (data) => {
    console.log(data);
    const [
      filter,
      filterLocation,
      filterMinimumAverageRate,
      filterMinimumReviews,
      filterMinimumBudget,
    ] = getValues([
      "filterName",
      "filterLocation",
      "filterMinimumAverageRate",
      "filterMinimumReviews",
      "filterMinimumBudget",
    ]);
    console.log(
      filter,
      filterLocation,
      filterMinimumAverageRate,
      filterMinimumReviews,
      filterMinimumBudget
    );

    let filterSendArray = [...user.filterValues];

    const IndexSameFilter = filterSendArray.findIndex(
      (el) => Object.keys(el)[0] === filter
    );
    if (IndexSameFilter >= 0) {
      filterSendArray.splice(IndexSameFilter, 1);
    }

    const filterSend = {
      filterValues: [
        ...filterSendArray,
        {
          [filter]: filterValue,
        },
      ],
    };
    mutate(filterSend);
  };

  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Add filter</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      <div className={classes.formCon}>
        <form className={classes.formFilter} onSubmit={handleSubmit(onsubmit)}>
          <select
            className={classes.selectFilter}
            onInput={filterNameHandler}
            {...register("filterName", { required: true })}
          >
            <option value="" className={classes.valueFilter}>
              ---choose filter---
            </option>
            {filterInput.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
          {filterName.includes("filterLocation") && (
            <select
              className={classes.valueFilter}
              {...register("filterLocation", { required: true })}
              onInput={filterValueHandler}
            >
              <option value="" className={classes.valueFilter}>
                ---anywhere---
              </option>
              {states.map((e, i) => (
                <option key={i} value={e.name} className={classes.valueFilter}>
                  {e.name}
                </option>
              ))}
            </select>
          )}
          {filterName.includes("filterMinimumAverageRate") && (
            <input
              onInput={filterValueHandler}
              type="number"
              className={classes.valueFilter}
              {...register("filterMinimumAverageRate", { required: true })}
            />
          )}
          {filterName.includes("filterMinimumReviews") && (
            <input
              onInput={filterValueHandler}
              type="number"
              className={classes.valueFilter}
              {...register("filterMinimumReviews", { required: true })}
            />
          )}
          {filterName.includes("filterMinimumBudget") && (
            <input
              onInput={filterValueHandler}
              type="number"
              className={classes.valueFilter}
              {...register("filterMinimumBudget", { required: true })}
            />
          )}
          {errors.filterLocation?.type === "required" && (
            <p className={classes.error}>please enter the location</p>
          )}
          {errors.filterMinimumAverageRate?.type === "required" && (
            <p className={classes.error}>please enter your state name</p>
          )}
          {errors.filterMinimumReviews?.type === "required" && (
            <p className={classes.error}>please enter the minimum reviews</p>
          )}
          {errors.filterMinimumBudget?.type === "required" && (
            <p className={classes.error}>please enter your minimum budget</p>
          )}
          {isError && (
            <p className={classes.error}>{error.response.data.message}</p>
          )}
          <button className={classes.buttonFilter}>Save</button>
        </form>
      </div>
    </div>
  );
};

export default FilterClient;
