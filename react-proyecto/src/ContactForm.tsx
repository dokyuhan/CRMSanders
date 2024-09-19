import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createContact, updateContact, getContact } from './ContactService';
import { TextField, Button } from '@mui/material';

interface ContactFormProps {
  contactId?: number; 
  onSuccess: () => void; 
}

const ContactForm: React.FC<ContactFormProps> = ({ contactId, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (contactId) {
      getContact(contactId).then((response) => {
        reset(response.data);
      });
    }
  }, [contactId, reset]);

  const onSubmit = async (data: any) => {
    if (contactId) {
      await updateContact(contactId, data);
    } else {
      await createContact(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField label="Nombre" {...register('nombre')} fullWidth margin="normal" />
      <TextField label="Apellido" {...register('apellido')} fullWidth margin="normal" />
      <TextField label="Email" {...register('email')} fullWidth margin="normal" />
      <TextField label="Teléfono" {...register('telefono')} fullWidth margin="normal" />
      <TextField label="Dirección" {...register('direccion')} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">
        {contactId ? 'Actualizar' : 'Crear'} Contacto
      </Button>
    </form>
  );
};

export default ContactForm;
