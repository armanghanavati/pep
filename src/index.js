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


// window.apiAddress="http://localhost:7142/api";  
//window.apiAddress="http://localhost:7021/api";  
window.apiAddress="http://172.16.1.40:3884/api"
//window.apiAddress="http://172.16.1.40:2884/api"; //peppay
// window.apiAddress="http://172.16.1.186:2884/api";   //coappweb
//window.apiAddress="http://79.127.54.146:2884/api"; 


window.siteAddress = "http://172.16.1.40:2884";

window.confirmPayment = "http://172.16.1.40:2884/api";

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
