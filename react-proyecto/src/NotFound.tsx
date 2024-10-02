// NotFound.tsx
const NotFound: React.FC = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-red-500">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-4xl font-bold text-red-600">404</h1>
          <p className="mt-4 text-gray-700">Página no encontrada</p>
          <p className="mt-2 text-gray-500">Lo sentimos, pero la página que buscas no existe.</p>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  