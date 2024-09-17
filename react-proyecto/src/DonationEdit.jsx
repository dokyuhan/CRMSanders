// DonationEdit.jsx
import React from 'react';
import { Edit, SimpleForm, NumberInput, TextInput } from 'react-admin';

export const DonationEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="usuario_id" />
            <NumberInput source="monto" />
            <TextInput source="metodo_pago" />
        </SimpleForm>
    </Edit>
);