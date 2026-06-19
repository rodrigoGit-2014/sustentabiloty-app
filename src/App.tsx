import { useStore } from './hooks/useStore';
import { Layout } from './components/layout';
import {
  UploadFlow,
  Dashboard,
  Ranking,
  ObraDetalle,
  Simulador,
  Asistente,
  Reportes
} from './components/views';
import './index.css';

function App() {
  const { view } = useStore();

  // Upload flow is fullscreen without layout
  if (view === 'upload') {
    return <UploadFlow />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'ranking':
        return <Ranking />;
      case 'detalle':
        return <ObraDetalle />;
      case 'simulador':
        return <Simulador />;
      case 'asistente':
        return <Asistente />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
    </Layout>
  );
}

export default App;
