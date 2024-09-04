// DonationList.jsx
import React from 'react';
import { List, Datagrid, TextField, NumberField, DateField } from 'react-admin';

export const DonationList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="usuario_id" />
            <NumberField source="monto" />
            <TextField source="metodo_pago" />
            <DateField source="fecha_donacion" />
        </Datagrid>
    </List>
);