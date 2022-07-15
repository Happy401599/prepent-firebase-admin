import React from "react";
import {
  Route, Redirect
} from "react-router-dom";

import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({children, ...rest}) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({location}) => {
        return auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth/signin",
              state: { from: location }
            }}
          />
        )
      }}
    />
  );
}