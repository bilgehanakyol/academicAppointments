import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [studentNo, setStudentNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [department, setDepartment] = useState('');

    async function registerUser(ev) {
        ev.preventDefault();
        // Sadece öğrenci rolü seçildiyse studentNo'yu requestData'ya ekleyin
        const requestData = {
            name,
            surname,
            email,
            password,
            role,
            department,
            ...(role === 'student' && { studentNo }), // studentNo'yu sadece öğrenci rolünde ekleyin
        };

        try {
            await axios.post('/register', requestData);
            alert('Registration is successful. Now you can log in');
        } catch (e) {
            alert('Registration failed. Please try again');
        }
    };

    return (
        <div className="mt-32 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    {/* Name and Surname Fields */}
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={name}
                        onChange={ev => setName(ev.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={surname}
                        onChange={ev => setSurname(ev.target.value)} 
                    />
                    
                    {/* Email and Password Fields */}
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} 
                    />

                    {/* Role Selection */}
                    <select 
                        value={role}
                        onChange={ev => setRole(ev.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="academician">Academician</option>
                    </select>

                    {/* Dynamic Form Fields Based on Role */}
                    {role === 'student' && (
                        <input 
                            type="text" 
                            placeholder="Student Number" 
                            value={studentNo}
                            onChange={ev => setStudentNo(ev.target.value)} 
                        />
                    )}
                    {/* Department Field (Common for both roles) */}
                    <input 
                        type="text" 
                        placeholder="Department" 
                        value={department}
                        onChange={ev => setDepartment(ev.target.value)} 
                    />

                    <button className="primary">Register</button>
                    
                    {/* Link to Login Page */}
                    <div className="text-center py-2 text-gray-500">
                        Do you have an account?
                        <Link className="underline text-bn" to={"/login"}>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
