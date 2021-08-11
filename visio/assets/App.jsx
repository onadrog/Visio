import React, { lazy, Suspense } from "react";
import {render} from "react-dom";
import { Provider } from "react-redux";
import store from "./redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
const VideoConnectSelector = lazy(() => import("./component/Video"));
const SidebarStore = lazy(() => import("./component/Sidebar"));
const CssBaseline = lazy(() => import("@material-ui/core/CssBaseline"));
const renderLoader = () => <p>Loading</p>;

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const App = () => (
  <Suspense fallback={renderLoader()}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <SidebarStore />
        <VideoConnectSelector />
      </Provider>
    </ThemeProvider>
  </Suspense>
);

render(<App />, document.getElementById("root"));

/**
 * Dispatch Event disconnection to Mercure hub before closing
 */
window.addEventListener("beforeunload", () => {
  let data = {
    topic: `https://aaa/disconnected`,
  };
  let formBody = [];
  for (let property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch("/disconnect", {
    method: "POST",
    body: formBody,
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
});
