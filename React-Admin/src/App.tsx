import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from 'react-admin';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { authProvider } from './Authenticator';
import { Dashboard } from './dashboard';
import Login from './Login';
import { Contacts } from './Contacts';
import { Companies } from './Companies';
import { Stats } from './Stats';
import RegisterPage from './Register'; 

export const App = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="*"
        element={
          <Admin
            layout={Layout}
            dataProvider={dataProvider}
            authProvider={authProvider}
            loginPage={Login}
            dashboard={Dashboard}
          >
            <Resource name="posts" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
            <Resource name="contacts" list={Contacts} />
            <Resource name="companies" list={Companies} />
            <Resource name="stats" list={Stats} />
          </Admin>
        }
      />
    </Routes>
  </Router>
);
