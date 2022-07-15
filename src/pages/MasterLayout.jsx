import React from "react";
import { 
  Route,
  Switch
} from "react-router-dom";

import DashboardPage from "./DashboardPage";

export default function MasterLayout(props) {

  return (
    <div>
      Some Layout

      <Switch>
        <Route index path='/' component={DashboardPage} />
      </Switch>
    </div>
  )
}