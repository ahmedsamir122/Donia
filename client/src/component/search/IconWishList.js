import classes from "./Talent.module.css";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { wishlistActions } from "../../store/wishlist";
import { useMutation, useQueryClient } from "react-query";
import {
  postDataProtect,
  deleteDataProtect,
  URL,
} from "../utils/queryFunctions";
const IconWishList = (props) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const [booked, setBooked] = useState(
    wishlist.some((item) => props.id === item.user)
  );
  const userRed = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createWishListData = (data) => {
    return postDataProtect(
      `${URL}/api/v1/wishList/${props.username}`,
      data,
      token
    );
  };

  const deleteWishListData = (data) => {
    return deleteDataProtect(`${URL}/api/v1/wishList/${props.id}`, data, token);
  };

  const {
    mutate: createWishList,
    isError: isErrorCreate,
    error: errorCreate,
  } = useMutation(createWishListData, {
    onSuccess: (data) => {
      queryClient.setQueryData("wishList", (oldData) => {
        return {
          ...data,
        };
      });
      dispatch(
        wishlistActions.toggle({
          user: props.id,
          photo: props.photo,
          username: props.username,
        })
      );
      setBooked(true);
    },
  });

  const {
    mutate: deleteWishList,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation(deleteWishListData, {
    onSuccess: (data) => {
      queryClient.setQueryData("wishList", (oldData) => {
        return {
          ...data,
        };
      });
      dispatch(wishlistActions.toggle({ user: props.id, photo: props.photo }));
      setBooked(false);
    },
  });

  const addWishlistHandler = (e) => {
    e.stopPropagation();
    if (!userRed) {
      navigate("/signin");
    } else {
      if (booked) {
        deleteWishList();
      } else {
        createWishList();
      }
    }
  };
  return (
    <React.Fragment>
      {booked && (
        <FavoriteIcon
          sx={{ color: "red", fontSize: "17px" }}
          className={classes.bookmarkIcon}
          onClick={addWishlistHandler}
        />
      )}
      {!booked && (
        <FavoriteBorderIcon
          sx={{ fontSize: "17px" }}
          className={classes.bookmarkIcon}
          onClick={addWishlistHandler}
        />
      )}
    </React.Fragment>
  );
};

export default IconWishList;
