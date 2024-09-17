import React from 'react';
import { Create, SimpleForm, NumberInput, TextInput, useRecordContext } from 'react-admin';

const DisplayUserId = () => {
    const record = useRecordContext();
    return record ? <div>User ID: {record.usuario_id}</div> : null;
};

export const DonationCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="usuario_id" />
            <NumberInput source="monto" />
            <TextInput source="metodo_pago" />
            <DisplayUserId />
        </SimpleForm>
    </Create>
);
