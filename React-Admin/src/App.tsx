import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { authProvider } from "./Authenticator";
import { Dashboard } from "./dashboard";
import Login from "./Login";
import { Contacts } from "./Contacts";
import { Companies } from "./Companies";
import { Stats } from "./Stats"; // Importa el componente de estadísticas

export const App = () => (
  <Admin 
    layout={Layout} 
    dataProvider={dataProvider} 
    authProvider={authProvider} 
    loginPage={Login} 
    dashboard={Dashboard}
  >
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
    <Resource name="contacts" list={Contacts} /> {/* Añade el recurso de contactos */}
    <Resource name="companies" list={Companies} /> {/* Añade el recurso de compañías */}
    <Resource name="stats" list={Stats} /> {/* Añade el recurso de estadísticas */}
  </Admin>
);
