import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DocumentsList from './pages/DocumentsList';
import DocumentsNew from './pages/DocumentsNew';
import DocumentEditor from './pages/DocumentEditor';
import SendFlow from './pages/SendFlow';
import PublicSigning from './pages/PublicSigning';
import Templates from './pages/Templates';
import Contacts from './pages/Contacts';
import Reports from './pages/Reports';
import TeamManagement from './pages/TeamManagement';
import Settings from './pages/Settings';
import AuditVerification from './pages/AuditVerification';
import { CookieConsent } from './components/ui/CookieConsent';

// New SaaS Feature components
import JoinInvite from './pages/JoinInvite';
import PublicWebForms from './pages/PublicWebForms';
import WebFormEditor from './pages/WebFormEditor';
import PublicFormSubmit from './pages/PublicFormSubmit';
import FormSubmissions from './pages/FormSubmissions';

// Super Admin imports
import SuperAdminOverview from './pages/super-admin/SuperAdminOverview';
import SuperAdminUsers from './pages/super-admin/SuperAdminUsers';
import SuperAdminWorkspaces from './pages/super-admin/SuperAdminWorkspaces';
import SuperAdminBilling from './pages/super-admin/SuperAdminBilling';
import SuperAdminPricing from './pages/super-admin/SuperAdminPricing';
import SuperAdminDocuments from './pages/super-admin/SuperAdminDocuments';
import SuperAdminUsage from './pages/super-admin/SuperAdminUsage';
import SuperAdminAuditLogs from './pages/super-admin/SuperAdminAuditLogs';
import SuperAdminEmails from './pages/super-admin/SuperAdminEmails';
import SuperAdminSupport from './pages/super-admin/SuperAdminSupport';
import SuperAdminSystemHealth from './pages/super-admin/SuperAdminSystemHealth';
import SuperAdminFeatureFlags from './pages/super-admin/SuperAdminFeatureFlags';
import SuperAdminAnnouncements from './pages/super-admin/SuperAdminAnnouncements';
import SuperAdminSecurity from './pages/super-admin/SuperAdminSecurity';
import SuperAdminExports from './pages/super-admin/SuperAdminExports';

export const App: React.FC = () => {
    return (
        <BrowserRouter basename="/">
            <Routes>
                {/* Public Landing */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Onboarding */}
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Dashboard & Workspace */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<DocumentsList />} />
                <Route path="/documents/new" element={<DocumentsNew />} />
                <Route path="/documents/:id/editor" element={<DocumentEditor />} />
                <Route path="/documents/:id/send" element={<SendFlow />} />
                
                {/* Professional Features */}
                <Route path="/templates" element={<Templates />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/verify" element={<AuditVerification />} />
                
                {/* Recipient signing & downloads (Public, no login needed) */}
                <Route path="/public/sign/:secureToken" element={<PublicSigning />} />

                {/* SaaS Invites & Public Forms */}
                <Route path="/join/:inviteCode" element={<JoinInvite />} />
                <Route path="/forms" element={<PublicWebForms />} />
                <Route path="/forms/new" element={<WebFormEditor />} />
                <Route path="/forms/:id/edit" element={<WebFormEditor />} />
                <Route path="/public/forms/:slug" element={<PublicFormSubmit />} />
                <Route path="/forms/:id/submissions" element={<FormSubmissions />} />

                {/* Super Admin Panel */}
                <Route path="/super-admin" element={<SuperAdminOverview />} />
                <Route path="/super-admin/users" element={<SuperAdminUsers />} />
                <Route path="/super-admin/workspaces" element={<SuperAdminWorkspaces />} />
                <Route path="/super-admin/billing" element={<SuperAdminBilling />} />
                <Route path="/super-admin/pricing" element={<SuperAdminPricing />} />
                <Route path="/super-admin/documents" element={<SuperAdminDocuments />} />
                <Route path="/super-admin/usage" element={<SuperAdminUsage />} />
                <Route path="/super-admin/audit-logs" element={<SuperAdminAuditLogs />} />
                <Route path="/super-admin/emails" element={<SuperAdminEmails />} />
                <Route path="/super-admin/support" element={<SuperAdminSupport />} />
                <Route path="/super-admin/system-health" element={<SuperAdminSystemHealth />} />
                <Route path="/super-admin/feature-flags" element={<SuperAdminFeatureFlags />} />
                <Route path="/super-admin/announcements" element={<SuperAdminAnnouncements />} />
                <Route path="/super-admin/security" element={<SuperAdminSecurity />} />
                <Route path="/super-admin/exports" element={<SuperAdminExports />} />
                
                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <CookieConsent />
        </BrowserRouter>
    );
};

export default App;
