import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                alert("Account created successfully! Please Login.")
                navigate('/login') // Success hone par Login page par bhej do
            } else {
                const data = await response.json()
                // Agar username already taken hai to wo error dikhao
                setError(data.username || "Registration failed. Try again.")
            }
        } catch (err) {
            setError("Server error. Is backend running?")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Join SaaS Invoice</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input type="text" name="username" onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register