import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const {data} = await axios.post('/login', {email,password});
            console.log("Before setUser:", data);
            alert('login succesfull');
            setRedirect(true);
        } catch(e) {
            alert('login failed: ' + e.response.data); // Hata mesajını kullanıcıya göster
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-32 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" 
                    placeholder="your@email.com" 
                    value={email} 
                    onChange={ ev => setEmail(ev.target.value)} />
                    <input type="password" 
                    placeholder="password" 
                    value={password} 
                    onChange={ ev => setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Dont have an account yet?   
                        <Link className="underline text-bn" to={"/register"}> Register Now</Link> 
                    </div>
                </form>
            </div>
        </div>
    );
}