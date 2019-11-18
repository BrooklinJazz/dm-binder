import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider as StyledComponentThemeProvider } from "styled-components";

import { ApolloProvider } from "@apollo/react-hooks";

import { client } from "./api/client";
import App from "./App";
import { Routes } from "./common/routes";
import AuthRoute from "./components/AuthRoute";
import { AuthProvider, useAuthState } from "./context/auth/store";
import { CampaignProvider } from "./context/campaign/store";
import { JournalStateProvider, JournalModalProvider } from "./context/journal";
import { ThemeProvider, useThemeState } from "./context/theme/store";
import DevComponents from "./DevComponents";
import Login from "./pages/Login/index";
import * as serviceWorker from "./serviceWorker";

const PageRouting = () => {
  const { token } = useAuthState();
  const { theme } = useThemeState();
  return (
    <StyledComponentThemeProvider theme={{ mode: theme }}>
      <>
        {process.env.NODE_ENV === "development" && <DevComponents />}
        <Switch>
          <AuthRoute
            isAuth={!token}
            redirectUrl={Routes.APP}
            path={Routes.LOGIN}
            component={Login}
          />
          <AuthRoute isAuth={!!token} path={Routes.APP} component={App} />
        </Switch>
      </>
    </StyledComponentThemeProvider>
  );
};

ReactDOM.render(
  // tslint:disable-next-line: jsx-wrap-multiline
  <BrowserRouter>
    <ApolloProvider client={client}>
      <AuthProvider>
        <CampaignProvider>
          <JournalStateProvider>
            <JournalModalProvider>
              <ThemeProvider>
                <PageRouting />
              </ThemeProvider>
            </JournalModalProvider>
          </JournalStateProvider>
        </CampaignProvider>
      </AuthProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
