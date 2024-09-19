import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { useEffect, useReducer } from 'react';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import { DonationList } from './DonationList';
import { MyLayout } from './design/dashboardLayout';
import { PostCreate, PostEdit, PostList } from './post-test';
import { Companies } from './Companies';
import { Stats } from './Stats';
import { DonacionesPorUsuario } from './admin/adminPage';
import Checkout from './Checkout';
import BusinessIcon from '@mui/icons-material/Business';
import BarChartIcon from '@mui/icons-material/BarChart';
import ContactsIcon from '@mui/icons-material/Contacts';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Contacts from './Contacts';

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
      const authString = localStorage.getItem('auth');
      if (!authString) {
        console.error('No auth data found in localStorage');
        return;
      } else {
        const auth = JSON.parse(authString);
        const role = auth.tipo_usuario;
        console.log('Login success detected. Role from localStorage: ', role);
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
      const authString = localStorage.getItem('auth');
      if (!authString) {
        console.error('No auth data found in localStorage');
        return;
      }

      const auth = JSON.parse(authString);
      const updatedRole = auth.tipo_usuario;

      if (updatedRole !== state.permissions) {
        dispatch({ type: UPDATE_PERMISSIONS, payload: updatedRole });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.permissions]);

  console.log('Rendering App with permissions: ', state.permissions);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/contact-manager"
          element={<Contacts />} 
        />
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
                  <Resource name="companies" list={Companies} icon={BusinessIcon}/>
                  <Resource name="stats" list={Stats} icon= {BarChartIcon}/>
                  <Resource name="contacts" list={Contacts} icon={ContactsIcon}/>
                  <Resource name="donations" list={DonationList} icon={VolunteerActivismIcon}/>
                </>
              )}              
            </Admin>
          }
        />
      </Routes>
    </Router>
  );
};
