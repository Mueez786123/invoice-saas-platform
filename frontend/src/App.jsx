import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom' 

// Pages Import
import Login from './pages/Login'
import CreateInvoice from './pages/CreateInvoice' 

// --- DASHBOARD COMPONENT ---
const Dashboard = ({ handleLogout }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('access')
    
    // DATA STATES
    const [clients, setClients] = useState([])
    const [invoices, setInvoices] = useState([])

    // DATA FETCHING
    useEffect(() => {
        if(!token) return;

        // 1. Fetch Clients
        fetch('http://127.0.0.1:8000/api/clients/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setClients(data)
        })

        // 2. Fetch Invoices (YEH NAYA HAI) 🚀
        fetch('http://127.0.0.1:8000/api/invoices/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setInvoices(data)
        })

    }, [token])

    // Helper: Client ID se Name dhoondne ke liye
    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId)
        return client ? client.name : 'Unknown Client'
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10">
             
             {/* HEADER */}
             <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🚀 Invoice Dashboard</h1>
                    <p className="text-gray-500">Welcome, Admin</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/create-invoice')} 
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition shadow"
                    >
                        + New Invoice
                    </button>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT SIDE: CLIENTS LIST */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-700 flex justify-between">
                        Your Clients 
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{clients.length}</span>
                    </h2>
                    <div className="grid gap-3">
                        {clients.length > 0 ? (
                            clients.map(client => (
                                <div key={client.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                    <h3 className="font-bold">{client.name}</h3>
                                    <p className="text-gray-500 text-sm">{client.email}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No clients yet.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: RECENT INVOICES (NEW SECTION) */}
                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-700 flex justify-between">
                        Recent Invoices
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{invoices.length}</span>
                    </h2>
                    <div className="grid gap-3">
                        {invoices.length > 0 ? (
                            invoices.map(inv => (
                                <div key={inv.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400">{inv.invoice_number}</p>
                                        <h3 className="font-bold text-lg">{getClientName(inv.client)}</h3>
                                        <p className="text-gray-500 text-xs">{inv.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-800">₹{parseFloat(inv.total_amount).toFixed(2)}</p>
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Paid: {inv.is_paid ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No invoices created yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('access'))
  
  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setToken(null)
  }

  return (
    <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        <Route 
            path="/" 
            element={token ? <Dashboard handleLogout={handleLogout}/> : <Navigate to="/login" />} 
        />
        
        <Route 
            path="/create-invoice" 
            element={token ? <CreateInvoice /> : <Navigate to="/login" />} 
        />
    </Routes>
  )
}

export default App  