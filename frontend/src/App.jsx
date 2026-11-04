import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CustomerProvider, useCustomers } from "./context/CustomerContext";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import CustomerDetailModal from "./components/CustomerDetailModal";
import AddCustomerModal from "./components/AddCustomerModal";
import EditCustomerModal from "./components/EditCustomerModal";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Preprocessing from "./pages/Preprocessing";
import BehaviorAnalysis from "./pages/BehaviorAnalysis";
import Prediction from "./pages/Prediction";
import RiskClassification from "./pages/RiskClassification";
import RetentionStrategy from "./pages/RetentionStrategy";
import History from "./pages/History";
import Profile from "./pages/Profile";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { setIsAddModalOpen } = useCustomers();

  const [authView, setAuthView] = useState("login"); // 'login' or 'register'
  const [activePage, setActivePage] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not authenticated, render Login / Register
  if (!isAuthenticated) {
    if (authView === "register") {
      return <Register onSwitchToLogin={() => setAuthView("login")} />;
    }
    return <Login onSwitchToRegister={() => setAuthView("register")} />;
  }

  // Render the selected module page
  const renderActivePage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} />;
      case "customers":
        return <Customers />;
      case "preprocessing":
        return <Preprocessing />;
      case "behavior":
        return <BehaviorAnalysis />;
      case "prediction":
        return <Prediction />;
      case "risk":
        return <RiskClassification setActivePage={setActivePage} />;
      case "retention":
        return <RetentionStrategy />;
      case "history":
        return <History setActivePage={setActivePage} />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar
          activePage={activePage}
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenAddCustomer={() => setIsAddModalOpen(true)}
        />

        <main>{renderActivePage()}</main>
      </div>

      {/* Global Modals */}
      <CustomerDetailModal />
      <AddCustomerModal />
      <EditCustomerModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <AppContent />
      </CustomerProvider>
    </AuthProvider>
  );
}
