import React from 'react';
import { Link } from 'react-router-dom';
import PaymentForm from './PaymentForm';

export default function Donate() {
    return (
        <div className='flex flex-col md:flex-row gap-8 m-4'>
            <div className='flex-1'>
                <PaymentForm />
            </div>
            <div className='bg-gray-500 flex-1 text-white rounded-lg'>
                <h1 className='text-xl font-bold p-6 bg-gray-700 rounded-top-lg'>¡Gracias por tu donación!</h1>
                <div className='p-8'>
                    <p className='mt-4'>¡Gracias por tu generosidad! Tu donación será destinada al proyecto "Agua para Todos" de Fundación Sanders. Con tu ayuda, podremos llevar agua potable a más comunidades necesitadas.</p>
                    <div className='p-6'>
                        <p className='mt-4'>Una vez que realices tu donación:</p>
                        <ul className='list-disc list-inside'>
                            <li>Recibirás un correo de confirmación</li>
                            <li>Podrás ver el estatus de tu donación en tu perfil</li>
                            <li>¡Podrás inspirar a otros a donar!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
