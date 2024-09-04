import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Admin,
  Resource
} from 'react-admin';
import { useEffect, useState } from 'react';
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
import { MyLayout } from './design/dashboardLayout';
import { DonationList } from './DonationList'; 
import { DonationCreate } from './DonationCreate';
import { DonationEdit } from './DonationEdit';

export const App = () => {
  const [permissions, setPermissions] = useState<string | null>(null);

  useEffect(() => {
    const handleLoginSuccess = () => {
      const role = localStorage.getItem('role');
      console.log("Login success detected. Role from localStorage: ", role);
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
      const updatedRole = localStorage.getItem('role');
      if (updatedRole !== permissions) {
        console.log("Rol actualizado detectado. Rol actual: ", updatedRole);
        setPermissions(updatedRole);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [permissions]);

  console.log("Renderizando App con permisos: ", permissions);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <Admin 
              layout={MyLayout} 
              dataProvider={dataProvider} 
              authProvider={authProvider} 
              loginPage={LoginPage} 
              dashboard={Dashboard}
            >
              <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
              <Resource name="contacts" list={Contacts} />
              <Resource name="companies" list={Companies} />
              <Resource name="stats" list={Stats} />
              <Resource name="donaciones" list={DonationList} edit={DonationEdit} create={DonationCreate} /> {/* Añadir recurso de donaciones */}
              {permissions === 'admin' && (
                <Resource name="todos" list={AdminList} edit={AdminEdit} create={AdminCreate} />
              )}
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};
