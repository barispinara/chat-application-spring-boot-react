import { GlobalStyles, useTheme } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AuthErrorListener from "./listener/AuthErrorListener";
import { store } from "./redux/store";
import { AppRoutes } from "./router/AppRoutes";

function App() {
  const theme = useTheme();

  return (
    <>
      <GlobalStyles
        styles={{
          html: { height: "100%" },
          body: {
            height: "100%",
            margin: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.default,
          },
          "#root": {
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      />
      <Provider store={store}>
        <BrowserRouter>
          <AuthErrorListener />
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
