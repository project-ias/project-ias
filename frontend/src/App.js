import { BrowserRouter, Route } from 'react-router-dom';

import SearchPage from './components/SearchPage'

function App() {
  return (
    <BrowserRouter>
        <Route path='/' component={SearchPage} />
    </BrowserRouter>
  );
}

export default App;
