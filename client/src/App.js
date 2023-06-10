import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Talent from "./pages/Talent";
import Contracts from "./pages/Contracts";
import OneContract from "./pages/OneContract";
import Messages from "./pages/Messages";
import EmptyRoom from "./component/messages/EmptyRoom";
import ChatRoom from "./component/messages/ChatRoom";
import ProtectedRoute from "./component/ProtectedRoute";
import Setting from "./pages/Setting";
import General from "./component/setting/General";
import PhoneNumber from "./component/setting/PhoneNumber";
import Password from "./component/setting/Password";
import BlockedList from "./component/setting/BlockedList";
import DeleteAccount from "./component/setting/DeleteAccount";
import Type from "./component/setting/Type";
import Client from "./pages/Client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/login-slice";
import { wishlistActions } from "./store/wishlist";
import { blocklistActions } from "./store/blocklist";
import { useQuery } from "react-query";
import React from "react";
import WishList from "./pages/WishList";
import { getWishList, URL } from "./component/utils/queryFunctions";
import Success from "./pages/Success";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/contracts", element: <Contracts /> },
  {
    path: "/messages",
    element: (
      //<ProtectedRoute>
      <Messages />
      // </ProtectedRoute>
    ),

    children: [
      { path: "/messages/", element: <EmptyRoom /> },
      { path: "/messages/:messageId", element: <ChatRoom /> },
    ],
  },
  {
    path: "/settings",
    element: <Setting />,
    children: [
      { path: "/settings", element: <General /> },
      { path: "/settings/generalInfo/", element: <General /> },
      { path: "/settings/phoneNumber/", element: <PhoneNumber /> },
      { path: "/settings/password/", element: <Password /> },
      { path: "/settings/blockedList/", element: <BlockedList /> },
      { path: "/settings/typeAccount/", element: <Type /> },
      { path: "/settings/deleteAccount/", element: <DeleteAccount /> },
    ],
  },
  { path: "/contracts/:contractId", element: <OneContract /> },
  {
    path: "/:username",
    element: <Talent />,
  },
  {
    path: "/u/:usernameClient",
    element: <Client />,
  },
  { path: "/search", element: <Search /> },
  { path: "/wishList", element: <WishList /> },
  { path: "/talent", element: <Talent /> },
  { path: "/success", element: <Success /> },
]);

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token") || "";
  const tokenRed = useSelector((state) => state.auth.token);

  const getMyProfile = () => {
    return getWishList(`${URL}/api/v1/users/me`, token);
  };

  const fetchWishList = () => {
    return getWishList(`${URL}/api/v1/wishList`, token);
  };

  const fetchBlockList = () => {
    return getWishList(`${URL}/api/v1/block`, token);
  };

  const {
    isLoading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfil,
  } = useQuery("myProfil", getMyProfile, {
    enabled: false, // Only execute the query if userId is truthy

    // enabled: !!token, // Only execute the query if userId is truthy
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: loadingWishList,
    error: errorWishList,
    data: dataWishList,
    refetch: refetchWishList,
  } = useQuery("wishList", fetchWishList, {
    enabled: false, // Only execute the query if userId is truthy
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: loadingBlockList,
    error: errorBlockList,
    data: dataBlockList,
    refetch: refetchBlockList,
  } = useQuery("blockList", fetchBlockList, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    refetchProfil();
    refetchWishList();
    refetchBlockList();
  }, [tokenRed, token]);
  useEffect(() => {
    if (!token || !dataProfile?.data.data?.user) {
      return;
    }
    const wishlistRed = dataWishList?.data.data.allWishList.map((item) => ({
      user: item.other.id,
      photo: item.other.photo,
      username: item.other.username,
    }));

    const blocklistRed = dataBlockList?.data.data.allBlockUsers.map((item) => ({
      user: item.other.id,
      photo: item.other.photo,
      username: item.other.username,
    }));

    dispatch(authActions.getToken(token));
    dispatch(authActions.login(dataProfile?.data.data.user));
    dispatch(wishlistActions.replaceWishList(wishlistRed || []));
    dispatch(blocklistActions.replaceBlockList(blocklistRed || []));
  }, [
    dataProfile?.data.data?.user,
    tokenRed,
    dispatch,
    token,
    dataWishList?.data.data.allWishList,
    dataBlockList?.data.data.allBlockList,
  ]);

  return <RouterProvider router={router} />;
}

export default App;
