import { PresentationProvider } from './stores/PresentationContext';
import { PitchbookGenerator } from './components/PitchbookGenerator';
import { PresentationViewer } from './components/presentation/PresentationViewer';

function App() {
  return (
    <PresentationProvider>
      <div className="flex bg-gray-950 text-gray-100 font-sans h-[calc(100vh-3rem)] mt-12 overflow-hidden">
        <PitchbookGenerator />
        <PresentationViewer />
      </div>
    </PresentationProvider>
  );
}

export default App;
