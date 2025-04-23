import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import { AppRoutes } from "./router/AppRoutes";
import { GlobalStyles } from "@mui/material";

function App() {
  return (
    <>
      <GlobalStyles
        styles={{
          html: { height: "100%" },
          body: { height: "100%", margin: 0 },
          "#root": { height: "100%" },
        }}
      />
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
