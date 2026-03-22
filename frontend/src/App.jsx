import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forgot from "./pages/Forgot";
import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import NewScan from "./pages/Dashboard/NewScan";
import ScanHistory from "./pages/Dashboard/ScanHistory";
import Report from "./pages/Dashboard/Report";
import Profile from "./pages/Dashboard/Profile";
import Settings from "./pages/Dashboard/Setting";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/new-scan"
          element={
            <PrivateRoute>
              <NewScan />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/history"
          element={
            <PrivateRoute>
              <ScanHistory />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard/reports"
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        />

        <Route path="/dashboard/Profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/dashboard/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;