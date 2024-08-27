import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";

export const Contacts = () => (
    <Card>
        <CardHeader title="Contact List" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemText primary="John Doe" secondary="john.doe@example.com" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Jane Smith" secondary="jane.smith@example.com" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Michael Johnson" secondary="michael.johnson@example.com" />
                </ListItem>
            </List>
        </CardContent>
    </Card>
);
