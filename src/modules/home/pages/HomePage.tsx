import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Topnav from '../../../components/Topnav';
import HomeRoute from '../routes/HomeRoute';

const HomePage = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route>
          <Topnav />
          <Route render={props => {
            return (
              <>
                <Sidebar {...props} />
                <div className="home-container">
                  <HomeRoute />
                </div>
              </>
            )
          }}/>
        </Route>
      </Switch>
    </BrowserRouter>
  )
};

export default HomePage;
