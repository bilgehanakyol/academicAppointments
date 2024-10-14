import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../components/UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false); 
    const { setUser } = useContext(UserContext); 
    const [userRole, setUserRole] = useState(''); 
    const [showQrScanner, setShowQrScanner] = useState(false); 

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password }); 
            const { data } = response; 
            setUser(data); 
            setUserRole(data.role); 
            alert('Login successful');
            setRedirect(true); 
        } catch (e) {
            console.error("Login failed:", e);
            alert('Login failed: ' + (e.response?.data || e.message)); 
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }
    
    return (
        <div className="mt-32 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={ ev => setEmail(ev.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={ ev => setPassword(ev.target.value)} 
                    />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet?   
                        <Link className="underline text-bn" to={"/register"}> Register Now</Link> 
                    </div>
                    <div className="text-center py-2 text-gray-500">
                        Do you forget your password?   
                        <Link className="underline text-bn" to={"/request-reset"}> Reset Password</Link> 
                    </div>
                </form>
            </div>
        </div>
    );
}
