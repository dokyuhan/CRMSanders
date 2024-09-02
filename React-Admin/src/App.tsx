import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
  Admin,
  Resource
} from 'react-admin';
import { useEffect, useState} from 'react';
import { Layout } from './Layout';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import { Contacts } from './Contacts';
import { Companies } from './Companies';
import { Stats } from './Stats';
import RegisterPage from './Register'; 
import { AdminCreate, AdminEdit, AdminList } from './admin/adminPage';
import { PostCreate, PostEdit, PostList } from './post-test';
import { MyLayout } from './design/dashboardLayout' 

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Perform some action repeatedly at set intervals
      const updatedRole = localStorage.getItem('role');
      if (updatedRole !== permissions) {
        setPermissions(updatedRole);
      }
    }, 0); // every 1000 milliseconds (1 second)
  
    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [permissions]); // Dependencies can be adjusted based on what needs to trigger updates
  

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <Admin layout={MyLayout} dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage} dashboard={Dashboard}>
              <Resource name = "posts" list = {PostList} edit = {PostEdit} create = {PostCreate} />
              <Resource name = "contacts" list = {Contacts} />
              <Resource name = "companies" list = {Companies} />
              <Resource name = "stats" list = {Stats} />
              {/*<Resource name = "todos" list = {AdminList} edit = {AdminEdit} create = {AdminCreate} /> */}
              {/* Condición para incluir la pestaña de Admin si el usuario es 'admin' */}
              {permissions == 'admin' && (
                <Resource name = "todos" list = {AdminList} edit = {AdminEdit} create = {AdminCreate} />
              )}
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};