import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store"; // Import as default
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

window.addEventListener("error", function (event) {
  if (event.error.message.includes("Failed to execute 'importScripts'")) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          {" "}
          {/* Wrap App with BrowserRouter */}
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);

reportWebVitals();
