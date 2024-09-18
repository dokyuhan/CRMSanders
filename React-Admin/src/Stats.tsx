import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";

export const Stats = () => (
    <Card>
        <CardHeader title="Estadísticas" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemText primary="Total de usuarios" secondary="1,250" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Proyectos activos" secondary="300" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Ganancia" secondary="$1,200,000" />
                </ListItem>
            </List>
        </CardContent>
    </Card>
);
