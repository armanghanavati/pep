import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
//import { createStore } from "redux";
import store from "./redux/reducers/store";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./assets/fonts/IRANSansWeb.ttf"
import "./assets/fonts/IRANSansWeb.ttf";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter } from "react-router-dom";


 window.apiAddress="http://localhost:7142/api";  
// window.apiAddress="https://pepapi.minoomart.ir/api";

//  window.apiAddress="http://172.16.1.40:2923/api";  

window.siteAddress = "https://pepapi.minoomart.ir";

window.confirmPayment = "https://pepapi.minoomart.ir/api";
window.apiAddressInspection="https://pepinspectionapi.minoomart.ir/api";
window.snapApi="https://pepsnappapi.minoomart.ir";
//window.snapApi="http://localhost:7031"
//window.apiAddressInspection="http://localhost:7021/api";  

// const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
