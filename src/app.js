import React from "react";

import SingleMachine from "./pages/singleMachine";
import AllMachines from "./pages/allMachines";
import Sidebar from "./components/sidebar";
import Files from "./pages/files";
import FourOhFour from "./pages/404";
import NewUpload from "./pages/newUpload";
import Settings from "./pages/settings";
import NewMachine from "./pages/new-machine";
import { Switch, Route, HashRouter } from "react-router-dom";
const App = () => {
  return (
    <div className="flex h-screen">
      <HashRouter>
        <Sidebar />
        <Switch>
          <Route exact path="/" component={AllMachines} />
          {/* this is the homepage route, this gets loaded when the application is started. */}
          <Route path="/machines">
            <AllMachines />
          </Route>
          <Route path="/files">
            <Files />
          </Route>

          <Route path="/upload">
            <NewUpload />
          </Route>
          <Route path="/single">
            <SingleMachine />
          </Route>
          <Route path="/new-machine">
            <NewMachine />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="*">
            <FourOhFour />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
