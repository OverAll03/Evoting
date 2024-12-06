import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutContent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any authentication tokens or session data
        localStorage.removeItem('token'); // Assuming token is stored in localStorage
        sessionStorage.clear(); // Clear session storage if used

        // Redirect to the login page
        navigate('/login');
    }, [navigate]);

    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Logging out...</h2>
            <p>We're logging you out and redirecting you to the login page.</p>
        </div>
    );
};

export default LogoutContent;
