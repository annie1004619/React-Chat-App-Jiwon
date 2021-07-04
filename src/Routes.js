import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import Landing from "./pages/Landing";

class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/users/login" component={Login} />
          <Route exact path="/users/signup" component={SignUp} />
          <Route exact path="/" component={Landing} />
          <Route exact path="/chat/list" component={ChatList} />
          <Route exact path="/chat/room/:roomId" component={ChatRoom} />
        </Switch>
      </Router>
    );
  }
}

export default Routes;
