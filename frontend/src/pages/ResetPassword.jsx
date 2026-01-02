import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    
    // URL se UID aur Token nikalo
    const { uid, token } = useParams() 
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/password-reset-confirm/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    uid: uid, 
                    token: token, 
                    new_password: newPassword 
                })
            })

            const data = await response.json()

            if (response.ok) {
                alert("Password Reset Successful! You can now login.")
                navigate('/login')
            } else {
                setError(data.error || "Link expired or invalid.")
            }
        } catch (err) {
            setError("Server error.")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Set New Password</h2>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">New Password</label>
                        <input 
                            type="password" 
                            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                        Confirm Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword