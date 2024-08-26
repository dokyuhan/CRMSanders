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

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} authProvider = {authProvider} loginPage = {Login} dashboard = {Dashboard}>
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
  </Admin>
);
