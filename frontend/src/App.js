import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import SearchPage from "./components/SearchPage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <Route path="/" component={SearchPage} /> */}
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={SearchPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
