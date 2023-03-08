import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Me from "./pages/Me";
import Search from "./pages/Search";
import Talent from "./pages/Talent";

// import RootLayout from "./component/rootLayout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/me", element: <Me /> },
      { path: "/search", element: <Search /> },
      { path: "/talent", element: <Talent /> },
      // { path: "/products/:productId", element: <SingleProduct /> },
      // { path: "/products/newproduct", element: <NewProduct /> },
      // { path: "/users", element: <Users /> },
      // { path: "/users/newuser", element: <NewUser /> },
      // { path: "/users/:userId", element: <SingleUser /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
