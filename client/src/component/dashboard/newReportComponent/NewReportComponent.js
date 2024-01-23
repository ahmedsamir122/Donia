import { URL } from "../../utils/queryFunctions";
import * as React from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import classes from "./NewReportComponent.module.css";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const NewReportComponent = (props) => {
  const tokenLocal = localStorage.getItem("token") || "";

  const postData = (data) => {
    return axios.post(`${URL}/api/v1/reports/`, data, {
      headers: { Authorization: `Bearer ${tokenLocal}` },
    });
  };

  const { mutate, isError, error, isLoading } = useMutation(postData, {
    onSuccess: () => {
      handleSuccessState();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onSubmit" });
  const onsubmit = async (data) => {
    const [type, complainerAbout, complainer, description] = getValues([
      "type",
      "complainerAbout",
      "complainer",
      "description",
    ]);

    mutate({
      type,
      complainerAbout,
      complainer,
      description,
    });
  };
  const handleSuccessState = () => {
    reset();
    withReactContent(Swal).fire({
      position: "center",
      icon: "success",
      title: "New Report has been Added",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <h2>Submit a Report</h2>
      <label>Enter Complainer ID</label>

      <input
        type="text"
        id="complainer"
        {...register("complainer", { required: true })}
        className={classes.textInput}
      />
      <input
        type="text"
        id="contractId"
        value={props.contractId}
        {...register("complainerAbout", { required: true })}
        className={` ${classes.textInput} ${classes.hidden}`}
      />

      <label>Choose Type</label>

      <select
        id="type"
        {...register("type", { required: true })}
        className={classes.typeGroup}
      >
        <option value="contract">Contract</option>
        <option value="user">User</option>
        <option value="review">Review</option>
      </select>
      <p>
        <label>Write a description of problem:</label>
      </p>
      <textarea
        {...register("description", { required: true })}
        id="description"
        className={classes.description}
        rows="10"
        cols="94"
      ></textarea>
      {isError && (
        <p className={classes.error}>{error.response.data.message}</p>
      )}
      <button type="submit" className={classes.submitBtn} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
export default NewReportComponent;
