import React, { useState } from 'react';
import ContactList from './ContactList';
import ContactForm from './ContactForm';

const ContactManager: React.FC = () => {
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditingContactId(id);
  };

  const handleSuccess = () => {
    setEditingContactId(null);
  };

  return (
    <div>
      <h1>Gestión de Contactos</h1>
      <ContactForm contactId={editingContactId || undefined} onSuccess={handleSuccess} />
      <ContactList onEdit={handleEdit} />
    </div>
  );
};

export default ContactManager;
