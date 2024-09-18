import * as React from 'react';
import { AppBar, TitlePortal, UserMenu, MenuItemLink, AppBarProps } from 'react-admin';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const MyAppBar: React.FC<AppBarProps> = (props) => (
    <AppBar {...props} color="primary">
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {/* Inserción del TitlePortal para mostrar el título de la página actual */}
            <TitlePortal />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {/* Sección central opcional, por ejemplo, para búsqueda o más información */}
            <Typography variant="h6">Bienvenido a tu Dashboard</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Botón para notificaciones */}
            <IconButton color="inherit">
                <NotificationsIcon />
            </IconButton>
        </Box>
    </AppBar>
);

