import React from "react";
import {
  getAuth, onAuthStateChanged
} from "firebase/auth";

export const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
}

export const KEY_AUTHENTICATED_USER = "key_authenticated_user_from_firebase";

export default function AuthProvider(props) {
  const auth = getAuth();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    return onAuthStateChanged(auth, (userCredentials) => {
      setUser(userCredentials);
      console.log("user credentials", userCredentials);
    });
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {props.children}
    </AuthContext.Provider>
  )
}