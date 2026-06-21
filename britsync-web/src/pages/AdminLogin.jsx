import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { apiCall } from '../utils/api';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Attempting login with password:', password);
        try {
            const data = await apiCall('auth/login', {
                method: 'POST',
                body: { password }
            });
            console.log('Login successful:', data);
            localStorage.setItem('admin_token', data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)'
        }}>
            <form onSubmit={handleLogin} className="glass" style={{
                padding: '3rem',
                borderRadius: '20px',
                textAlign: 'center',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 className="text-gradient" style={{ marginBottom: '2rem' }}>Admin Access</h2>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input-full"
                    style={{ marginBottom: '1.5rem' }}
                />
                <Button width="100%">Login</Button>
            </form>
        </div>
    );
};

export default AdminLogin;
