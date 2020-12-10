import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

import Home from "./containers/Home/Home";
import Logging from "./components/Logging/Logging";

function App() {
  return (
    <div className="App">
      <Switch>
            <Route path="/Home" exact component={Home}/>
            <Route path="/Logging" exact component={Logging}/>
            <Redirect from="/" to="/Logging" />
      </Switch>
    </div>
  );
}

export default App;
