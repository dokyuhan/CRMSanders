import * as React from 'react';
import { Layout } from 'react-admin';
import { MyAppBar } from './appBar';

interface MyLayoutProps {
    children: React.ReactNode;
}

export const MyLayout: React.FC<MyLayoutProps> = ({ children }) => (
    <Layout appBar={MyAppBar}>
        {children}
    </Layout>
);