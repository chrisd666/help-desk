import React from "react";
import { useSelector } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import AuthScreen from './screens/AuthScreen'
import HelpDeskScreen from "./screens/HelpDeskScreen";
// import LoginPage from "./layouts/Login/LoginPage";
// import DashBoard from "./layouts/DashBoard/DashBoard";
// import { appStore } from "./store/appStore";
// import { observer } from "mobx-react";

const AppRouter = () => {
  const store = useSelector(state => state)

  console.log('STORE', store)

  return (
    <Router>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Switch>
          {!store.isLoggedIn && <Redirect from="/desk" to="/" exact />}
          {store.isLoggedIn && <Redirect from="/" to="/desk" exact />}
          <Route exact path="/desk" component={HelpDeskScreen} />
          <Route exact path="/" component={AuthScreen} />
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
