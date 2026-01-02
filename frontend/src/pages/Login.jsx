import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const navigate = useNavigate() // 2. Hook initialize karo

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })

        const data = await response.json()

        if (response.ok) {
            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)
            setToken(data.access)
            
            // 🔥 YEH LINE MISSING THI:
            navigate('/')  // User ko Dashboard par bhejo
        } else {
            setError('Invalid Username or Password!')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="text-right mb-4">
                    <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                        Forgot Password?
                    </Link>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>
                    <p className="mt-4 text-center text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-600">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login