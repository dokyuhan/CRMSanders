import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { useEffect, useReducer } from 'react';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import { DonationList } from './DonationList'; 
import { DonationCreate } from './DonationCreate';
import { DonationEdit } from './DonationEdit';
import { MyLayout } from './design/dashboardLayout'; // Layout personalizado para react-admin
import { PostCreate, PostEdit, PostList } from './post-test'; // Recursos solo para admin
import { Contacts } from './Contacts'; // Recursos solo para admin
import { Companies } from './Companies'; // Recursos solo para admin
import { Stats } from './Stats'; // Recursos solo para admin
import { DonacionesPorUsuario } from './admin/adminPage'; // Recurso solo para admin

// Reducer para gestionar permisos
const SET_PERMISSIONS = 'SET_PERMISSIONS';
const UPDATE_PERMISSIONS = 'UPDATE_PERMISSIONS';

interface State {
  permissions: string | null;
}

interface Action {
  type: string;
  payload: string | null;
}

const permissionsReducer = (state: State, action: Action) => {
    switch (action.type) {
        case SET_PERMISSIONS:
            return { ...state, permissions: action.payload };
        case UPDATE_PERMISSIONS:
            return { ...state, permissions: action.payload };
        default:
            return state;
    }
};

export const App = () => {
  const [state, dispatch] = useReducer(permissionsReducer, { permissions: null });

  useEffect(() => {
    const handleLoginSuccess = () => {
      const role = localStorage.getItem('role');
      dispatch({ type: SET_PERMISSIONS, payload: role });
    };

    window.addEventListener('login-success', handleLoginSuccess);

    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedRole = localStorage.getItem('role');
      if (updatedRole !== state.permissions) {
        dispatch({ type: UPDATE_PERMISSIONS, payload: updatedRole });
      }
    }, 1000); 

    return () => clearInterval(intervalId);
  }, [state.permissions]);

  console.log("Rendering App with permissions: ", state.permissions);

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
              {/* Recursos disponibles solo para usuarios admin */}
              {state.permissions === 'admin' && (
                <>
                  <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
                  <Resource name="contacts" list={Contacts} />
                  <Resource name="companies" list={Companies} />
                  <Resource name="stats" list={Stats} />
                  <Resource name="user_donations" list={DonacionesPorUsuario} />
                </>
              )}
              
              {/* Recursos disponibles para todos los usuarios */}
              <Resource name="donations" list={DonationList} edit={DonationEdit} create={DonationCreate} />
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};
