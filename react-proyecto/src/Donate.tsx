import React from 'react';
import { Link } from 'react-router-dom';
import PaymentForm from './PaymentForm';

export default function Donate(){
    return(
        <>
            <h1>Haz tu donación aquí</h1>
            <div>
                <PaymentForm/>
            </div>
        </>
    )
}