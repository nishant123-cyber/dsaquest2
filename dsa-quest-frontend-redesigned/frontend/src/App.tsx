import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ArrayVisualizer from "./pages/ArrayVisualizer";
import StackVisualizer from "./pages/StackVisualizer";
import QueueVisualizer from "./pages/QueueVisualizer";
import Quiz from "./pages/Quiz";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualizer/arrays"
        element={
          <ProtectedRoute>
            <ArrayVisualizer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualizer/stack"
        element={
          <ProtectedRoute>
            <StackVisualizer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualizer/queue"
        element={
          <ProtectedRoute>
            <QueueVisualizer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:topicSlug"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
