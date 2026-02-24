import { useState } from 'react';
import FormularioRematricula from './components/FormularioRematricula';
import ListaMatriculas from './components/ListaMatriculas';
import UploadRematriculas from './components/UploadRematriculas';
import UploadCandidatos from './components/UploadCandidatos';
import { GraduationCap, Upload, FileText } from 'lucide-react';

type TabType = 'matriculas' | 'uploads';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('matriculas');

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

        <div className="mb-8">
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setActiveTab('matriculas')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'matriculas'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              Matrículas
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'uploads'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="w-5 h-5" />
              Uploads
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'matriculas' && (
            <>
              <FormularioRematricula />
              <ListaMatriculas />
            </>
          )}

          {activeTab === 'uploads' && (
            <>
              <UploadCandidatos />
              <UploadRematriculas />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
