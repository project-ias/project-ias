import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import SearchPage from "./components/SearchPage";
import LoginPage from "./components/LoginPage";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import ThirdPartyEmailPassword, {Google, ThirdPartyEmailPasswordAuth} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { BACKEND_URL, FRONTEND_URL } from "./constants/constants";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

SuperTokens.init({
  appInfo: {
      appName: "Project IAS",
      apiDomain: BACKEND_URL,
      websiteDomain: FRONTEND_URL,
  },
  recipeList: [
      ThirdPartyEmailPassword.init({
          signInAndUpFeature: {
              providers: [
                  Google.init(),
              ]
          }
      }),
      Session.init(),
      EmailPassword.init()
  ]
});

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Route path="/" component={SearchPage} /> */}
        <Switch>
          {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}
          <Route path="/login" component={LoginPage} />
          <Route path="/">
            <ThirdPartyEmailPasswordAuth>
                <SearchPage/>
            </ThirdPartyEmailPasswordAuth>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
