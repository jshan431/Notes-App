import React from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Auth from '../pages/Auth';
import MainNavigation from "./Navigation/MainNavigation";
import Footer from "./Footer";
import Notes from '../pages/Notes';
import Home from '../pages/Home';

function App() {

  return (
    <div>
      <Router>
        <MainNavigation />
        <main>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/notes" exact>
            <Notes />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Redirect to="/" />
        </Switch>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
