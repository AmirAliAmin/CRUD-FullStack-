import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    console.log("ProtectedRoute Debug:", { user, loading, allowedRoles });

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        console.log("No user found, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        console.log("Access denied - User role:", user.role, "Allowed roles:", allowedRoles);
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Access Denied!</strong> You don't have permission to view this page.
                    <div className="mt-2">
                        <p>Your role: <strong>{user.role}</strong></p>
                        <p>Required roles: <strong>{allowedRoles.join(', ')}</strong></p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;