import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Common components
import Navbar from "./components/common/Navbar";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Main components
import Dashboard from "./components/dashboard/Dashboard";
import DocumentForm from "./components/documents/DocumentForm";
import DocumentView from "./components/documents/DocumentView";
import SearchPage from "./components/search/SearchPage";
import TeamQA from "./components/QA/TeamQA";
import Profile from "./components/Profile/Profile";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/new"
            element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <DocumentView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/documents/:id/edit"
            element={
              <ProtectedRoute>
                <DocumentForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/qa"
            element={
              <ProtectedRoute>
                <TeamQA />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
