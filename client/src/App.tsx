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
            height: "95%",
            width: "95%",
            borderRadius: "16px",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            padding: "16px",
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
