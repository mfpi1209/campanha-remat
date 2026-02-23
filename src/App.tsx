import FormularioRematricula from './components/FormularioRematricula';
import ListaMatriculas from './components/ListaMatriculas';
import UploadRematriculas from './components/UploadRematriculas';
import UploadCandidatos from './components/UploadCandidatos';
import { GraduationCap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Sistema de Rematrícula</h1>
          </div>
          <p className="text-gray-600 text-lg">Gerencie as matrículas e campanhas de forma simples e eficiente</p>
        </div>

        <div className="space-y-8">
          <UploadCandidatos />
          <FormularioRematricula />
          <UploadRematriculas />
          <ListaMatriculas />
        </div>
      </div>
    </div>
  );
}

export default App;
