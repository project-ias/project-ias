import { BrowserRouter, Route } from "react-router-dom";
import "./styles/main.scss";
import SearchPage from "./components/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route path="/" component={SearchPage} />
      </div>
    </BrowserRouter>
  );
}

export default App;
