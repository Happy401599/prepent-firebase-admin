import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import {
  message
} from "antd";
import "antd/dist/antd.css";

import {
  initializeApp
} from "firebase/app";

import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Auth Pages
 */
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

/**
 * Main Features Pages
 */
import MasterLayout from "./pages/MasterLayout";

const firebaseConfig = {
  apiKey: "AIzaSyC7CGdykxtxe8ICY-kdtyqL5vZJO3-YZcM",
  authDomain: "prepent-6d4c9.firebaseapp.com",
  databaseURL: "https://prepent-6d4c9-default-rtdb.firebaseio.com",
  projectId: "prepent-6d4c9",
  storageBucket: "prepent-6d4c9.appspot.com",
  messagingSenderId: "792409498123",
  appId: "1:792409498123:web:bae253e629cf0c2849dd0e",
  measurementId: "G-NZMYJCBJWB"
};
const app = initializeApp(firebaseConfig);

/**
 * AntDesign Components Init
 */
message.config({

});

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path='/auth/signin' component={SignInPage} />
          <Route path='/auth/signup' component={SignUpPage} />
          <Route path='/auth/reset_password' component={ForgotPasswordPage} />

          <ProtectedRoute index path='/'>
            <MasterLayout />
          </ProtectedRoute>
          <Route path='*'>
            <Redirect to='/auth/signin' />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
