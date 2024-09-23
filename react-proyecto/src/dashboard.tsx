import { Card, CardContent, CardHeader } from "@mui/material";
import { Link } from 'react-router-dom';
import Visuales from './Visuales';

export const Dashboard = () => (
    <Card>
        <CardHeader title="Bienvenido al panel de control" />
        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
        <Visuales/>
    </Card>
);