import { Card, CardContent, CardHeader, Button } from "@mui/material";

export const Dashboard = () => (
    <div className="flex items-center justify-center h-full p-4 rounded-lg p-6">
        <Card className="w-full h-full bg-gray-800 text-gray-100 shadow-lg flex flex-col rounded-lg p-6">
            <CardHeader title="Bienvenido a la Página de donaciones NO OFICIAL de Fundación Sanders" className="bg-gray-700 text-white" />
            <CardContent className="flex-1">
                <h2 className="text-xl font-semibold mb-4">¡Hola, Usuario!</h2>
                <p className="mb-4">
                    Esta es tu plataforma para gestionar donaciones de manera efectiva y sencilla.

                    Estas donaciones serán destinadas al proyecto "Agua para Todos" de Fundación Sanders. Mediante sistemas de captación de agua pluvial y abasto de agua potable
                </p>
                <button>
                    <a href="https://sanders.com.mx/causas/agua-para-todos/" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
                        Conoce más!
                    </a>
                </button>
                <p className="my-4">
                    ¡Esperamos que disfrutes de la experiencia y que tu generosidad inspire a otros!
                </p>
            </CardContent>
            <Button 
                variant="contained" 
                color="primary" 
                component="a" 
                href="https://sanders.com.mx/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 m-4p-4"
            >
                Visita la página oficial de Fundación Sanders
            </Button>
        </Card>
    </div>
);
