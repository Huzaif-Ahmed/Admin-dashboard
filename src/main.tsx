import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "./App.tsx";
import Login from "./Login.tsx";
import "./index.css";

const hasCredentials = localStorage.getItem("token");
let isLoggedin = false;

// console.log("metadata", import.meta.env);
if (hasCredentials) {
  // try {
  //   const decodedCredentials = atob(hasCredentials);
  //   let [username, password] = decodedCredentials.split(':');

  //   if(username=="garden.finance" && password=="garden.finance"){

  //     isLoggedin = true;
  //   }
  //   else{
  //     isLoggedin = false;
  //   }
  // } catch (error) {
  //   console.error('Error decoding credentials:', error);
  // }
  isLoggedin = true;
}

console.log(hasCredentials);

const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedin ? <App /> : <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: isLoggedin ? <Navigate to="/" replace /> : <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
