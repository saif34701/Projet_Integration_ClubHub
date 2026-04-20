import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ClubsPage from "./pages/ClubsPage";
import ClubDetailPage from "./pages/ClubDetailPage";
import AnnoncesPage from "./pages/AnnoncesPage";
import EvenementsPage from "./pages/EvenementsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentRequests from "./pages/student/StudentRequests";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentMeetings from "./pages/student/StudentMeetings";
// Responsable
import ResponsableDashboard from "./pages/responsable/ResponsableDashboard";
import ResponsableRequests from "./pages/responsable/ResponsableRequests";
import ResponsableMembers from "./pages/responsable/ResponsableMembers";
import ResponsableAnnouncements from "./pages/responsable/ResponsableAnnouncements";
import ResponsableEvents from "./pages/responsable/ResponsableEvents";
import ResponsableMeetings from "./pages/responsable/ResponsableMeetings";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/:id" element={<ClubDetailPage />} />
            <Route path="/annonces" element={<AnnoncesPage />} />
            <Route path="/evenements" element={<EvenementsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* Student */}
            <Route path="/etudiant" element={<StudentDashboard />} />
            <Route path="/etudiant/demandes" element={<StudentRequests />} />
            <Route path="/etudiant/notifications" element={<StudentNotifications />} />
            <Route path="/etudiant/reunions" element={<StudentMeetings />} />
            {/* Responsable */}
            <Route path="/responsable" element={<ResponsableDashboard />} />
            <Route path="/responsable/demandes" element={<ResponsableRequests />} />
            <Route path="/responsable/membres" element={<ResponsableMembers />} />
            <Route path="/responsable/annonces" element={<ResponsableAnnouncements />} />
            <Route path="/responsable/evenements" element={<ResponsableEvents />} />
            <Route path="/responsable/reunions" element={<ResponsableMeetings />} />
            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clubs" element={<AdminClubs />} />
            <Route path="/admin/utilisateurs" element={<AdminUsers />} />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
