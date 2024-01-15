import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import Home from './home/Home';
import { ProtectedRoute } from './Auth/ProtectedRoute';
import { useAuth } from './Auth/AuthProvider';
import { NotAllowedRoute } from "./Auth/NotAllowedRoute";
import PageNotFound from "./utils/404-Page"
import FinancialDataProvider from "./home/FinancialDataProvider";

export default function Routes (){

const {token, setToken} = useAuth();

const routesForLoggedInUser = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <FinancialDataProvider><Home /></FinancialDataProvider>
      }
    ]
  }
]
const routesForNotLoggedInUser = [
  {
    path: "/auth",
    element: <NotAllowedRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ]
  },
];

const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />
  },
  ...routesForLoggedInUser,
  ...routesForNotLoggedInUser
]);

  return (
    <RouterProvider router={router} />
  )
}