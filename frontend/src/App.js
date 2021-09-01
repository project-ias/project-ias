import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "axios";
import "./styles/main.scss";
import SearchPage from "./components/SearchPage";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react";
import ThirdPartyEmailPassword, {Google, ThirdPartyEmailPasswordAuth} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { BACKEND_URL, FRONTEND_URL, USER_URL } from "./constants/constants";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

Session.addAxiosInterceptors(axios);

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
          },
          onHandleEvent: async (context) => {
            if (context.action === "SESSION_ALREADY_EXISTS") {
            } else {
              let {id, email} = context.user;
              if (context.action === "SUCCESS") {
                  localStorage.setItem("userEmail", email);
                  axios
                  .post(USER_URL, {email})
                  .then((user) => {
                    try {
                      localStorage.setItem(
                        "userPrelims",
                        JSON.stringify(user.data.prelims)
                      );
                      localStorage.setItem(
                        "userMains",
                        JSON.stringify(user.data.mains)
                      );
                    } catch {}
                  })
              }
          }
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
