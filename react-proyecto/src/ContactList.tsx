import React, { useEffect, useState } from 'react';
import { getContacts, deleteContact } from './ContactService';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

interface Contact {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

const ContactList: React.FC<{ onEdit: (id: number) => void }> = ({ onEdit }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const response = await getContacts();
    setContacts(response.data);
  };

  const handleDelete = async (id: number) => {
    await deleteContact(id);
    loadContacts(); 
  };

  return (
    <List>
      {contacts.map((contact) => (
        <ListItem key={contact.id}>
          <ListItemText
            primary={`${contact.nombre} ${contact.apellido}`}
            secondary={contact.email}
          />
          <ListItemSecondaryAction>
            <Button variant="contained" color="primary" onClick={() => onEdit(contact.id)}>
              Editar
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(contact.id)}>
              Eliminar
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default ContactList;
