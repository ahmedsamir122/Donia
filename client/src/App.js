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
import React from "react";
import WishList from "./pages/WishList";
import Success from "./pages/Success";
import NavBar from "./component/navBar/NavBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      { path: "/", element: <Home /> },

      { path: "/contracts", element: <Contracts /> },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
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
    ],
  },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <SignIn /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
