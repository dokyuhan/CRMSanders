import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { useEffect, useReducer} from 'react';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import { DonationList } from './DonationList'; 
import { DonationCreate } from './DonationCreate';
import { DonationEdit } from './DonationEdit';
import { i18nProvider } from './Polyglot';
import { MyLayout } from './design/dashboardLayout';
import { PostCreate, PostEdit, PostList } from './post-test'; 
import { Contacts } from './Contacts'; 
import { Companies } from './Companies'; 
import { Stats } from './Stats'; 
import { DonacionesPorUsuario } from './admin/adminPage'; 
import Checkout from './Checkout'; 

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
          localStorage.setItem('payloadRole', JSON.stringify(action.payload));
            return { ...state, permissions: action.payload };
        default:
            return state;
    }
};

export const App = () => {
  const initPermissions = JSON.parse(localStorage.getItem('authRole') || 'null');
  const [state, dispatch] = useReducer(permissionsReducer, { permissions: initPermissions });

  useEffect(() => {
    const handleLoginSuccess = () => {
      let auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (!auth) {
        console.error("No auth data found in localStorage");
        return;
      }
      else {
        const role = auth.tipo_usuario;
        console.log("Login success detected. Role from localStorage: ", role);
        dispatch({ type: SET_PERMISSIONS, payload: role });
      }
    };

    window.addEventListener('login-success', handleLoginSuccess);

    return () => {
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (!auth) {
        console.error("No auth data found in localStorage");
        return;
      }

      const updatedRole = auth.tipo_usuario;
      if (updatedRole !== state.permissions) {
        console.log("Updating permissions to: ", updatedRole);
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
        <Route path="/checkout" element={<Checkout />} /> {/* Añadido el componente Checkout */}
        <Route
          path="*"
          element={
            <Admin 
              layout={MyLayout} 
              dataProvider={dataProvider} 
              authProvider={authProvider} 
              loginPage={LoginPage} 
              dashboard={Dashboard}
              i18nProvider={i18nProvider}
            >
              {/* Recursos disponibles solo para usuarios admin */}
              {state.permissions === 'admin' && (
                <>
                  <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} />
                  <Resource name="contacts" list={Contacts} />
                  <Resource name="companies" list={Companies} />
                  <Resource name="stats" list={Stats} />
                  {/* <Resource name="user_donations" list={DonacionesPorUsuario} /> */}
                </>
              )}
              
              {/* Recursos disponibles para todos los usuarios */}
              <Resource name="donations" list={DonationList}/>
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};
