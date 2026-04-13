import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./navbar/Navbar";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { Bookmarks } from "./pages/Bookmarks";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DataProvider>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </DataProvider>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
