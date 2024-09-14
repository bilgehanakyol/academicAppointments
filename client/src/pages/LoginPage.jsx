import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";
// TODO: Forgot password
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false); // Yönlendirme durumu
    const { setUser } = useContext(UserContext); // UserContext'ten setUser fonksiyonunu alıyoruz
    const [userRole, setUserRole] = useState(''); // Kullanıcı rolünü takip etmek için state ekledik

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', { email, password }); // Giriş isteği yapılıyor
            console.log("Axios response:", response); // Gelen yanıtı konsola yazdır
            const { data } = response; // Gelen yanıtın içindeki data'yı alıyoruz
            setUser(data); // Kullanıcı bilgilerini UserContext'e kaydediyoruz
            setUserRole(data.role); // Kullanıcı rolünü state'e kaydediyoruz
            alert('Login successful');
            setRedirect(true); // Yönlendirme için flag'i true yapıyoruz
        } catch (e) {
            console.error("Login failed:", e); // Hata konsola yazdırılıyor
            alert('Login failed: ' + (e.response?.data || e.message)); // Hata mesajını kullanıcıya gösteriyoruz
        }
    }

    // Eğer redirect true ise anasayfaya yönlendir
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
                </form>
            </div>
        </div>
    );
}
