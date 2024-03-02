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
import Dashboard from "./component/dashboard/Dashboard";
import DashboardSection from "./component/dashboard/dashboardSection/DashboardSection";
import UsersSectiion from "./component/dashboard/usersSectiion/UsersSectiion";
import UserSection from "./component/dashboard/usersSectiion/userSection/UserSection";
import UsersTable from "./component/dashboard/usersSectiion/usersTable/UsersTable";
import ContractsSection from "./component/dashboard/contractsSection/ContractsSection";
import ContractsTable from "./component/dashboard/contractsSection/contractsTable/ContractsTable";
import ContractSection from "./component/dashboard/contractsSection/contractSection/ContractSection";
import ReviewsSection from "./component/dashboard/reviewsSection/ReviewsSection";
import ReviewsTable from "./component/dashboard/reviewsSection/reviewsTable/ReviewsTable";
import ReportsSection from "./component/dashboard/reportsSection/ReportsSection";
import ReportsTable from "./component/dashboard/reportsSection/reportsTable/ReportsTable";
import ReportSection from "./component/dashboard/reportsSection/reportSection/ReportSection";
import Conversion from "./component/dashboard/contractsSection/conversion/Conversion";
import Blocked from "./pages/Blocked";
import PreventRoute from "./component/PreventRoute";

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
  {
    path: "/signup",
    element: (
      <PreventRoute>
        <SignUp />
      </PreventRoute>
    ),
  },
  {
    path: "/signin",
    element: (
      <PreventRoute>
        <SignIn />
      </PreventRoute>
    ),
  },
  {
    path: "/blocked",
    element: (
      <ProtectedRoute>
        <Blocked />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "/dashboard/", element: <DashboardSection /> },
      {
        path: "/dashboard/contracts/",
        element: <ContractsSection />,
        children: [
          {
            path: "/dashboard/contracts/:id",
            element: <ContractSection />,
          },
          {
            path: "/dashboard/contracts/messaages/:id",
            element: <Conversion />,
          },
          {
            path: "/dashboard/contracts/",
            element: <ContractsTable />,
          },
        ],
      },
      {
        path: "/dashboard/users/",
        element: <UsersSectiion />,
        children: [
          {
            path: "/dashboard/users/:username",
            element: <UserSection />,
          },
          {
            path: "/dashboard/users/",
            element: <UsersTable />,
          },
        ],
      },
      {
        path: "/dashboard/reviews/",
        element: <ReviewsSection />,
        children: [
          /*{
          path: "/dashboard/users/:username",
          element: <UserSection />,
        },*/
          {
            path: "/dashboard/reviews/",
            element: <ReviewsTable />,
          },
        ],
      },
      {
        path: "/dashboard/reports/",
        element: <ReportsSection />,
        children: [
          {
            path: "/dashboard/reports/:id",
            element: <ReportSection />,
          },
          {
            path: "/dashboard/reports/",
            element: <ReportsTable />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
