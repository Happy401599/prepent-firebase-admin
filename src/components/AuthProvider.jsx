import React from "react";
import {
  getAuth
} from "firebase/auth";

export const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

export const KEY_AUTHENTICATED_USER = "key_authenticated_user_from_firebase";

export default function AuthProvider(props) {

  const auth = getAuth();

  return (
    <AuthContext.Provider value={auth}>
      {props.children}
    </AuthContext.Provider>
  )
}