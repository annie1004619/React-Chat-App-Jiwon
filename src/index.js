import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./Routes";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import configStore from "./config/store";

const { store, persistor } = configStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Routes />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
