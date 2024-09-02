import { List, Datagrid, TextField, SimpleForm, TextInput, ReferenceField, Edit, EditButton, Create, ReferenceInput, BooleanInput, BooleanField } from "react-admin";
import { AdminFilterSidebar } from './adminFilter';

export const AdminList = () => {
    return (
        <List aside = { <AdminFilterSidebar />} >
            <Datagrid>
                <TextField source = "id" />
                <ReferenceField source = "userId" reference = "users" />
                <TextField source = "title" />
                <BooleanField source = "completed" />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export const AdminEdit = () => (
        <Edit>
            <SimpleForm>
                <TextInput source = "id" InputProps = {{disabled: true}} />
                <ReferenceInput source = "userId" reference = "users" />
                <TextInput source = "title" />
                <BooleanInput source = "completed" />
            </SimpleForm>
        </Edit>
);

export const AdminCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source = "userId" reference = "users" />
            <TextInput source = "name" />
            <TextInput source = "title" />
            <BooleanInput source = "completed" />
        </SimpleForm>
    </Create>
);