import classes from "./CreateContract.module.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useForm } from "react-hook-form";
import ContractDetail from "./ContractDetail";
import ContractPreview from "./ContractPreview";
import { useState } from "react";

const CreateContract = (props) => {
  const [preview, setPreview] = useState(false);
  const [contractData, setContractData] = useState({});

  const dataContractHandler = (contract) => {
    setContractData((prev) => {
      return { ...contract };
    });
    setPreview(true);
    console.log(preview);
  };
  return (
    <div className={classes.main}>
      <div className={classes.top}>
        <div className={classes.topTitle}>
          <KeyboardArrowLeftOutlinedIcon
            className={classes.arrowIcon}
            onClick={props.onClick}
          />
          <h3 className={classes.title}>Open aContract</h3>
        </div>
        <div>
          <CloseOutlinedIcon
            className={classes.closeIcon}
            onClick={props.onClick}
          />
        </div>
      </div>
      {preview && (
        <ContractPreview
          onContract={contractData}
          onClick={() => setPreview(false)}
        />
      )}
      {!preview && <ContractDetail onData={dataContractHandler} />}
    </div>
  );
};

export default CreateContract;
