import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  usePermissions,
} from 'react-admin';
import { useEffect, useState} from 'react';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { authProvider } from './Authenticator';
import { Dashboard } from './dashboard';
import Login from './Login';
import { Contacts } from './Contacts';
import { Companies } from './Companies';
import { Stats } from './Stats';
import RegisterPage from './Register'; 
import { AdminPage } from './adminPage';

export const App = () => {
  const [permissions, setPermissions] = useState<string | null>(null);

  useEffect(() => {
    const handleLoginSuccess = () => {
      const role = localStorage.getItem('role');
      setPermissions(role);
    };
  
    window.addEventListener('login-success', handleLoginSuccess);
  
    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    if (permissions) {
      console.log("Permisos actualizados a: ", permissions);
    }
  }, [permissions]);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider} loginPage={Login} dashboard={Dashboard}>
              <Resource name="posts" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
              <Resource name="contacts" list={Contacts} />
              <Resource name="companies" list={Companies} />
              <Resource name="stats" list={Stats} />
              {/* Condición para incluir la pestaña de Admin si el usuario es 'admin' */}
              {permissions == 'admin' && (
                <Resource name="admin" list={AdminPage} />
              )}
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};