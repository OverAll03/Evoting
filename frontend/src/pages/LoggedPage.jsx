import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/logged/Sidebar';
import DashboardContent from '../components/logged/DashboardContent';
import ProfileContent from '../components/logged/ProfileContent';
import ManageSessionsContent from '../components/logged/ManageSessionsContent';
import SecuritySettingsContent from '../components/logged/SecuritySettingsContent';
import PreferencesContent from '../components/logged/PreferencesContent';
import LogoutContent from '../components/logged/LogoutContent';

const LoggedPage = () => {
    const location = useLocation();
    const path = location.pathname;
    const [isSidebarToggled, setSidebarToggled] = useState(false);

    const handleSidebarToggle = () => setSidebarToggled(!isSidebarToggled);

    const renderContent = () => {
        switch (path) {
            case '/dashboard':
                return <DashboardContent />;
            case '/profile':
                return <ProfileContent />;
            case '/manage-sessions':
                return <ManageSessionsContent />;
            case '/security':
                return <SecuritySettingsContent />;
            case '/preferences':
                return <PreferencesContent />;
            case '/logout':
                return <LogoutContent />;
            default:
                return <div>404 - Page Not Found</div>; 
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar isToggled={isSidebarToggled} onToggle={handleSidebarToggle} />

            <div className={`flex-1 transition-all duration-300 ${
                isSidebarToggled ? 'ml-60' : 'ml-16'
            } bg-gradient-to-br from-blue-50 via-white to-blue-200`}>
                <div className="p-6 min-h-screen bg-opacity-75">
                    <div className="bg-transparent p-6 rounded-md shadow-md">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoggedPage;
