// DonationCreate.jsx
import React from 'react';
import { Create, SimpleForm, NumberInput, TextInput } from 'react-admin';

export const DonationCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="usuario_id" />
            <NumberInput source="monto" />
            <TextInput source="metodo_pago" />
        </SimpleForm>
    </Create>
);