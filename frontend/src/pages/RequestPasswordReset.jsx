import { useState } from 'react'
import { Link } from 'react-router-dom'

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        try {
            const response = await fetch('http://127.0.0.1:8000/api/password-reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()
            
            if (response.ok) {
                setMessage("Check your email (Terminal) for the reset link!")
            } else {
                setError(data.error || "Something went wrong.")
            }
        } catch (err) {
            setError("Server error. Is backend running?")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Reset Password</h2>
                
                {message && <p className="text-green-600 text-sm mb-4 bg-green-100 p-2 rounded">{message}</p>}
                {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-2 rounded">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Enter your email</label>
                        <input 
                            type="email" 
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Send Reset Link
                    </button>
                </form>
                
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}

export default RequestPasswordReset