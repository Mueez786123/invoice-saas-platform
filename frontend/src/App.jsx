import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom' 

// Pages Import
import Login from './pages/Login'
import CreateInvoice from './pages/CreateInvoice' 

// --- DASHBOARD COMPONENT ---
// (Humne Dashboard ko alag tukde mein nikal diya taaki main App saaf rahe)
const Dashboard = ({ handleLogout, clients }) => {
    const navigate = useNavigate() // Page badalne ke liye hook

    return (
        <div className="min-h-screen bg-gray-100 p-10">
             
             {/* HEADER AREA */}
             <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🚀 Invoice Dashboard</h1>
                    <p className="text-gray-500">Welcome, Admin</p>
                </div>
                
                <div className="flex gap-4">
                    {/* NEW INVOICE BUTTON */}
                    <button 
                        onClick={() => navigate('/create-invoice')} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition shadow"
                    >
                        + New Invoice
                    </button>
                    
                    {/* LOGOUT BUTTON */}
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* CLIENT LIST SECTION */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Clients</h2>
                <div className="grid gap-4">
                     {clients.length > 0 ? (
                        clients.map(client => (
                            <div key={client.id} className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{client.name}</h3>
                                    <p className="text-gray-500 text-sm">{client.email}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                  Active
                                </span>
                            </div>
                        ))
                     ) : (
                        <p className="text-gray-500 text-center py-10">No clients found. Please add clients in Django Admin.</p>
                     )}
                </div>
            </div>
        </div>
    )
}

// --- MAIN APP COMPONENT ---
function App() {
  // 1. State Management
  const [token, setToken] = useState(localStorage.getItem('access'))
  const [clients, setClients] = useState([])
  
  // 2. Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setToken(null) // Token hatate hi user Login page par chala jayega
  }

  // 3. Data Fetching (Sirf tab jab Token ho)
  useEffect(() => {
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/clients/', {
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(res => {
        if (res.status === 401) {
            handleLogout() // Agar token expire ho gaya to logout
        }
        return res.json()
    })
    .then(data => {
        // Safety check: Agar data list nahi hai to crash mat hona
        if(Array.isArray(data)){
            setClients(data)
        }
    })
    .catch(err => console.error("Error fetching clients:", err))
  }, [token])

  // 4. Routing System (Traffic Police)
  return (
    <Routes>
        {/* RASTA 1: Login Page */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* RASTA 2: Dashboard (Protected - Agar token nahi hai to Login par bhejo) */}
        <Route 
            path="/" 
            element={token ? <Dashboard handleLogout={handleLogout} clients={clients}/> : <Navigate to="/login" />} 
        />
        
        {/* RASTA 3: Create Invoice Page (Protected) */}
        <Route 
            path="/create-invoice" 
            element={token ? <CreateInvoice /> : <Navigate to="/login" />} 
        />
    </Routes>
  )
}

export default App