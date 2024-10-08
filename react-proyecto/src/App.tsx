import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import { useEffect, useReducer, useState, ReactNode, Fragment} from 'react';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import { i18nProvider } from './Polyglot';
import { MyLayout } from './design/dashboardLayout';
import { Companies } from './Companies';
import { Stats } from './Stats';
import Contacts from './Contactos/Contacts';
import CreateContact from './Contactos/CreateContact';
import EditContact from './Contactos/EditContacts';
import ContactsIcon from '@mui/icons-material/Contacts';
import BusinessIcon from '@mui/icons-material/Business';
import InsightsIcon from '@mui/icons-material/Insights';
import DonatePage from './Donate';
import Topbar from './global/Topbar';
import Sidebar from './global/Sidebar';
import NotFound from './NotFound';
import Donadores from './Donadores';
import Cookies from 'js-cookie';
import PaymentForm from './PaymentForm';

const SET_PERMISSIONS = 'SET_PERMISSIONS';
const UPDATE_PERMISSIONS = 'UPDATE_PERMISSIONS';
const LOGOUT = 'LOGOUT';

const Home: React.FC = () => {
  const [isSidebarOpen, setIsSidebar] = useState(false);
  const userData = Cookies.get('user_role');
  const auth = userData ? JSON.parse(userData).role : null;
  //console.log('User role:', auth);

  return (
  <Routes>
    <Route
        path="/*"
        element={
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar setIsSidebar={setIsSidebar} />
              <main className="flex-1 overflow-y-auto p-4 bg-gray-600">
                <Routes>
                  <Route path="/" element={ <Dashboard />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/donations" element={<Contacts/>} />
                  <Route path="/checkout" element={<PaymentForm />} />
                  {(auth === 'admin' || auth === 'colaborador') && (
                    <>
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/companies" element={<Companies />} />
                      <Route path="/create-contact" element={<CreateContact />} />
                      <Route path="/edit-contact/:id" element={<EditContact />} />
                    </>
                  )}
                  {auth === 'admin' && (
                    <>
                    </>
                  )}
                </Routes>
              </main>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

interface State {
  permissions: string | null;
  authenticated: boolean;
}

interface Action {
  type: string;
  payload: string | null;
}

const permissionsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_PERMISSIONS:
      return { ...state, permissions: action.payload, authenticated: !!action.payload };
    case LOGOUT:
      Cookies.remove('user_role');
      Cookies.remove('user_ID');
      return { ...state, permissions: null, authenticated: false };
    default:
      return state;
  }
};

export const App = () => {
  //console.log('App component is mounting');
  const [state, dispatch] = useReducer(permissionsReducer, {
    permissions: null,
    authenticated: false
  });


  useEffect(() => {
    const handleLoginSuccess = () => {
        setTimeout(() => { // Agrega un pequeño retraso para asegurar que la cookie esté lista
            const userData = Cookies.get('user_role');
            if (userData) {
                const { role } = JSON.parse(userData);
                //console.log("Role found after login: ", role);
                dispatch({ type: SET_PERMISSIONS, payload: role });
            } else {
                console.error('No user data found in cookies immediately after login');
            }
        }, 500); // Ajusta este tiempo si es necesario
    };

    window.addEventListener('login-success', handleLoginSuccess);
    return () => {
        window.removeEventListener('login-success', handleLoginSuccess);
      };
  }, []);

  useEffect(() => {
    // Verifica la cookie al cargar el componente para manejar recargas de la página
    const userData = Cookies.get('user_role');
    if (userData) {
        const { role } = JSON.parse(userData);
        dispatch({ type: SET_PERMISSIONS, payload: role });
    } else {
        dispatch({ type: LOGOUT, payload: null });
    }
  }, []);

  console.log('Rendering App with permissions: ', state.permissions);
  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch({ type: LOGOUT, payload: null });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const removeAuthOnNavigation = () => {
      if (window.location.pathname === '/login') {
        dispatch({ type: LOGOUT, payload: null });
      }
    };

    window.addEventListener('popstate', removeAuthOnNavigation);

    return () => {
      window.removeEventListener('popstate', removeAuthOnNavigation);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={state.authenticated ? <Home />: <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};