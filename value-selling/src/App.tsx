import { PresentationProvider } from './stores/PresentationContext';
import { PitchbookGenerator } from './components/PitchbookGenerator';
import { PresentationViewer } from './components/presentation/PresentationViewer';
import { GlobalNav } from './components/GlobalNav';

function App() {
  return (
    <PresentationProvider>
      <div className="flex bg-gray-950 text-gray-100 font-sans h-screen pt-12 overflow-hidden">
        <GlobalNav />
        <PitchbookGenerator />
        <PresentationViewer />
      </div>
    </PresentationProvider>
  );
}

export default App;
