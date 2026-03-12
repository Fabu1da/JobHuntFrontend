import './App.css';

import { Navbar } from './navbar/Navbar';
import { Upload } from './sections/Upload';
import { ProfileSection } from './sections/ProfileSection';
import { Filter } from './sections/Filter';
import { ErrorSection } from './sections/ErrorSection';
import { JobLists } from './sections/JobLists';
import { JobContainer } from './sections/JobContainer';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DataProvider>
          <div className="app">
            <Navbar />
            <Upload />
            <ProfileSection />
            <Filter />
            <ErrorSection  />
            <JobLists />
            <JobContainer />
          </div>
        </DataProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
