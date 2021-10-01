import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SuperTokens, {
  getSuperTokensRoutesForReactRouterDom,
} from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword, {
  Google,
  ThirdPartyEmailPasswordAuth,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Payment from "./components/Payment";
import SearchPage from "./components/SearchPage";
import { BACKEND_URL, FRONTEND_URL, USER_URL } from "./constants/constants";
import { checkTrialStatus } from "./helpers/trialPeriod";
import "./styles/main.scss";

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
        providers: [Google.init()],
      },
      onHandleEvent: async (context) => {
        if (context.action === "SESSION_ALREADY_EXISTS") {
        } else {
          let { id, email } = context.user;
          if (context.action === "SUCCESS") {
            localStorage.setItem("userEmail", email);
            axios.post(USER_URL, { email }).then((user) => {
              try {
                localStorage.setItem(
                  "userPrelims",
                  JSON.stringify(user.data.prelims)
                );
                localStorage.setItem(
                  "userMains",
                  JSON.stringify(user.data.mains)
                );
                localStorage.setItem("payDate", user.data.payDate);
              } catch {}
            });
          }
        }
      },
    }),
    Session.init(),
    EmailPassword.init(),
  ],
});

function App() {
  if (!localStorage.getItem("searchCount")) {
    localStorage.setItem("timeNow", performance.now());
    localStorage.setItem("searchCount", 0);
  }

  return (
    <BrowserRouter>
      <div className="App">
        {/* <Route path="/" component={SearchPage} /> */}
        <Switch>
          {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}
          <Route path="/payment">
            <Payment />
          </Route>
          <Route path="/">
            {!checkTrialStatus() ? (
              <ThirdPartyEmailPasswordAuth>
                <SearchPage />
              </ThirdPartyEmailPasswordAuth>
            ) : (
              <SearchPage />
            )}
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
