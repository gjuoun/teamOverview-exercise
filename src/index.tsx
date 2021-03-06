import React from "react";
import ReactDOM from "react-dom";
import Routes from "./pages/routes";
// import reportWebVitals from "./reportWebVitals";

// ! styles
import "@styles/global.style.css"


//! redux
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@redux/store";

//! react-query
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
