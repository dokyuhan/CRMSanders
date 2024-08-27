import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";

export const Companies = () => (
    <Card>
        <CardHeader title="Company List" />
        <CardContent>
            <List>
                <ListItem>
                    <ListItemText primary="TechCorp" secondary="techcorp@example.com" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="InnovateX" secondary="innovatex@example.com" />
                </ListItem>
                <ListItem>
                    <ListItemText primary="GreenEnergy" secondary="greenenergy@example.com" />
                </ListItem>
            </List>
        </CardContent>
    </Card>
);
