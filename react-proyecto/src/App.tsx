import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useEffect, useReducer, useState, ReactNode, Fragment} from 'react';
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './Login/Authenticator';
import { i18nProvider } from './Polyglot';
import { MyLayout } from './design/dashboardLayout';
import { Dashboard } from './dashboard';
import LoginPage from './Login/Login';
import RegisterPage from './Register';
import Companies from './Companies';
import { Stats } from './Stats';
import Contacts from './Contactos/Contacts';
import CreateContact from './Contactos/CreateContact';
import EditContact from './Contactos/EditContacts';
import Donadores from './Donaciones/Donations';
import CreateDonation from './Donaciones/CreateDonation';
import EditDonation from './Donaciones/EditDonations';
import Registrocola from './Registro colab';
import ContactsIcon from '@mui/icons-material/Contacts';
import BusinessIcon from '@mui/icons-material/Business';
import InsightsIcon from '@mui/icons-material/Insights';
import DonatePage from './Donate';
import Topbar from './global/Topbar';
import Sidebar from './global/Sidebar';
import AuthRequired from './Login/Load'
import Cookies from 'js-cookie';
import PaymentForm from './PaymentForm';
import AdminDashboard from './AdminDashboard'

const SET_PERMISSIONS = 'SET_PERMISSIONS';
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
                  <Route path="/donations" element={<Contacts/>} />
                  <Route path="/checkout" element={<PaymentForm />} />
                  {(auth === 'admin') && (
                    <>
                      <Route path="/AdminDashboard" element={ <AdminDashboard />} />
                      <Route path="/register-colab" element={<Registrocola />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/companies" element={<Companies />} />
                      <Route path="/donors" element={<Donadores />} />
                    </>
                  )}

                  {(auth === 'colaborador') && (
                    <>
                      <Route path="/AdminDashboard" element={ <AdminDashboard />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/companies" element={<Companies />} />
                      <Route path="/create-contact" element={<CreateContact />} />
                      <Route path="/edit-contact/:id" element={<EditContact />} />
                      <Route path="/create-donation" element={<CreateDonation />} />
                      <Route path="/edit-donation/:id" element={<EditDonation />} />
                      <Route path="/donadores" element={<Donadores/>}/>
                    </>
                  )}

                  {(auth === 'donador') && (
                    <>
                    <Route path="/donate" element={<DonatePage />} />
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
      authProvider.logout;
      return { ...state, permissions: null, authenticated: false };
    default:
      return state;
  }
};



export const App = () => {
  //console.log('App component is mounting');
  const [state, dispatch] = useReducer(permissionsReducer, {
    permissions: Cookies.get('user_role') || null,
    authenticated: !!Cookies.get('user_role')
  });

  // Manejar la autenticación en el momento del login o al cargar la página
  useEffect(() => {
    const handleAuthentication = () => {
      const userData = Cookies.get('user_role');
      if (userData) {
        console.log('User role found in cookie:', userData);
        dispatch({ type: SET_PERMISSIONS, payload: userData });
      } else if (state.authenticated) {
        console.log('No user role found, triggering logout');
        dispatch({ type: LOGOUT, payload: null});
      }
    };

    window.addEventListener('login-success', handleAuthentication);

    return () => {
      window.removeEventListener('login-success', handleAuthentication);
    };
  }, [state.authenticated]);

  console.log('Rendering App', { authenticated: state.authenticated, permissions: state.permissions });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={
          <AuthRequired>
            <Home />
          </AuthRequired> 
        } />
      </Routes>
    </Router>
  );
};