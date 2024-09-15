import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";

export const Stats = () => (
    <Card>
        <CardHeader title="Statistics" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemText primary="Total Users" secondary="1,250" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Active Projects" secondary="300" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Revenue" secondary="$1,200,000" />
                </ListItem>
            </List>
        </CardContent>
    </Card>
);

