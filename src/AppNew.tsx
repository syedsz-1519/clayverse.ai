import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './contexts/AuthContext';

// Import components
import LandingPage from './components/LandingPage';
import StudentLoginModal from './components/StudentLoginModal';
import AdminLoginModal from './components/AdminLoginModal';
import StudentApp from './AppStudent';
import AdminDashboard from './components/AdminDashboard';

export default function AppNew() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-slate-600 font-semibold">Loading Clayverse AI...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <>
        <AnimatePresence mode="wait">
          <LandingPage
            onStudentLogin={() => setIsStudentLoginOpen(true)}
            onAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        </AnimatePresence>

        <StudentLoginModal
          isOpen={isStudentLoginOpen}
          onClose={() => setIsStudentLoginOpen(false)}
          onSuccess={() => {
            setIsStudentLoginOpen(false);
          }}
        />

        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setIsAdminLoginOpen(false);
          }}
        />
      </>
    );
  }

  // If authenticated as student, show student app
  if (user?.role === 'student') {
    return (
      <StudentApp
        onLogout={() => {
          // Logout will be handled by FloatingNav which has access to useAuth
        }}
      />
    );
  }

  // If authenticated as admin, show admin dashboard
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Fallback
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-600 font-semibold">Invalid user state</p>
    </div>
  );
}
