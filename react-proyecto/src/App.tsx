import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { useEffect, useReducer, useState } from 'react';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import { i18nProvider } from './Polyglot';
import { MyLayout } from './design/dashboardLayout';
import { Companies } from './Companies';
import { Stats } from './Stats';
import Checkout from './Checkout';
import Contacts from './Contactos/Contacts';
import CreateContact from './Contactos/CreateContact'; 
import EditContact from './Contactos/EditContacts'; 
import ContactsIcon from '@mui/icons-material/Contacts';
import BusinessIcon from '@mui/icons-material/Business';
import InsightsIcon from '@mui/icons-material/Insights';
import SignUp from './SignUp';
import SignIn from './SignIn';
import DonatePage from './Donate';
import Topbar from './global/Topbar';
import Sidebar from './global/Sidebar';
import NotFound from './NotFound';
import Donadores from './Donadores';

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
  const [isSidebar, setIsSidebar] = useState(true);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const handleLoginSuccess = () => {
      let auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (!auth) {
        console.error('No auth data found in localStorage');
        return;
      } else {
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
      let auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (!auth) {
        console.error('No auth data found in localStorage');
        return;
      }

      const updatedRole = auth.tipo_usuario;
      if (updatedRole !== state.permissions) {
        console.log('Updating permissions to: ', updatedRole);
        dispatch({ type: UPDATE_PERMISSIONS, payload: updatedRole });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.permissions]);

  console.log('Rendering App with permissions: ', state.permissions);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/create-contact" element={<CreateContact />} />
        <Route path="/edit-contact/:id" element={<EditContact />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route
          path="/*"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar setIsSidebar={setIsSidebar} />
                <main className="flex-1 overflow-y-auto p-4 bg-gray-600">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/donate" element={<DonatePage />} />
                    <Route path="/donations" element={<Contacts/>} />
                    <Route path="/checkout" element={<Checkout />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );  
};
