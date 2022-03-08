/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Topnav from '../../../components/Topnav';
import HomeRoute from '../routes/HomeRoute';

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route>
          <Topnav toggle={handleOpen}/>
          <Route render={props => {
            return (
              <>
                <Sidebar {...props} location={props.location} isOpen={isOpen} toggle={handleOpen} />
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
