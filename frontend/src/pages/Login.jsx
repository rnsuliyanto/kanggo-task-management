import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white border-4 border-black p-8 w-full max-w-md shadow-neo">
                <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-black pb-2">Login</h2>
                {error && <div className="bg-neo-pink text-white font-bold p-3 border-2 border-black mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="neo-input bg-neo-bg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="neo-input bg-neo-bg"
                        required
                    />
                    <button type="submit" className="neo-button bg-neo-blue text-white mt-4">
                        MASUK
                    </button>
                </form>
                <p className="mt-4 font-bold">
                    Belum punya akun? <Link to="/register" className="text-neo-blue hover:underline">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;