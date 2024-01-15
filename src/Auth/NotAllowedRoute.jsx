import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const NotAllowedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};