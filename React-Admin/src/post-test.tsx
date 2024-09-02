import { List, Datagrid, TextField, SimpleForm, TextInput, ReferenceField, Edit, EditButton, ReferenceInput, Create } from "react-admin";

export const PostList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source = "id" />
                <ReferenceField source = "userId" reference = "users" />
                <TextField source = "title" />
                <TextField source = "body" />
                <EditButton />
            </Datagrid>
        </List>
    );
};

export const PostEdit = () => (
        <Edit>
            <SimpleForm>
                <TextInput source = "id" InputProps = {{disabled: true}} />
                <ReferenceInput source = "userId" reference = "users" />
                <TextInput source = "title" />
                <TextInput source = "body" />
            </SimpleForm>
        </Edit>
);

export const PostCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source = "userId" reference = "users" />
            <TextInput source = "title" />
            <TextInput source = "body" multiline rows = {5} />
        </SimpleForm>
    </Create>
);