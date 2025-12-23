import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom' 

// Pages Import
import Login from './pages/Login'
import CreateInvoice from './pages/CreateInvoice' 

// --- ARCHITECTURE COMPONENT: DASHBOARD ---
// Responsible for: Data Visualization, List Management, and Document Retrieval
const Dashboard = ({ handleLogout }) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('access')
    
    // STATES
    const [clients, setClients] = useState([])
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(false) // Global loading state for UX

    // --- ARCHITECTURE: DATA FETCHING LAYER ---
    useEffect(() => {
        if(!token) return;

        // Parallel Fetching for Performance
        const fetchData = async () => {
            try {
                const [clientRes, invoiceRes] = await Promise.all([
                    fetch('http://127.0.0.1:8000/api/clients/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://127.0.0.1:8000/api/invoices/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (clientRes.ok) {
                    const clientData = await clientRes.json();
                    if(Array.isArray(clientData)) setClients(clientData);
                }

                if (invoiceRes.ok) {
                    const invoiceData = await invoiceRes.json();
                    if(Array.isArray(invoiceData)) setInvoices(invoiceData);
                }

            } catch (error) {
                console.error("Critical Data Fetch Error:", error);
            }
        };

        fetchData();
    }, [token]);

    // --- HELPER: RELATIONAL MAPPING ---
    // Maps Foreign Key IDs to Human Readable Names
    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId)
        return client ? client.name : 'Unknown Client'
    }

    // --- CORE LOGIC: SECURE PDF DOWNLOAD ---
    // Handles Binary Stream Retrieval from Django
    const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/download/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Security: Authenticated Request
                },
            });

            if (response.ok) {
                // 1. Convert response to Blob (Binary Large Object)
                const blob = await response.blob();
                
                // 2. Create a temporary URL for the Blob
                const url = window.URL.createObjectURL(blob);
                
                // 3. Create a hidden link and trigger click (Browser Trick)
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
                document.body.appendChild(link);
                link.click();
                
                // 4. Cleanup memory
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                alert("Failed to download PDF. Server returned an error.");
                console.error("PDF Download Error:", response.statusText);
            }
        } catch (error) {
            console.error("Network Error during download:", error);
            alert("Network error. Please check your connection.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10 font-sans">
             
             {/* SECTION: HEADER */}
             <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-8 flex justify-between items-center border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">🚀 SaaS Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Overview & Management</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/create-invoice')} 
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <span>+</span> New Invoice
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="bg-white text-red-500 border border-red-200 px-6 py-2 rounded-lg hover:bg-red-50 font-semibold transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SECTION: CLIENTS (1/3 Width) */}
                <div className="lg:col-span-1">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Clients</h2>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            Total: {clients.length}
                        </span>
                    </div>
                    
                    <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {clients.length > 0 ? (
                            clients.map(client => (
                                <div key={client.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <h3 className="font-bold text-gray-800">{client.name}</h3>
                                    <p className="text-gray-500 text-xs mt-1">{client.email}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-400 text-sm">No clients found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION: INVOICES (2/3 Width) */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Recent Invoices</h2>
                        <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                            Generated: {invoices.length}
                        </span>
                    </div>

                    <div className="grid gap-3">
                        {invoices.length > 0 ? (
                            invoices.map(inv => (
                                <div key={inv.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-center group">
                                    
                                    {/* Invoice Info */}
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <span className="text-2xl">📄</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-800 text-lg">{getClientName(inv.client)}</h3>
                                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                    {inv.invoice_number}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-xs mt-1">Created: {inv.date}</p>
                                        </div>
                                    </div>

                                    {/* Actions & Status */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">₹{parseFloat(inv.total_amount).toLocaleString('en-IN')}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${inv.is_paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {inv.is_paid ? "PAID" : "PENDING"}
                                            </span>
                                        </div>
                                        
                                        {/* DOWNLOAD BUTTON */}
                                        <button 
                                            onClick={() => handleDownloadPDF(inv.id, inv.invoice_number)}
                                            className="bg-gray-900 text-white p-3 rounded-lg hover:bg-black transition shadow-lg active:scale-95"
                                            title="Download PDF"
                                        >
                                            ⬇
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-400">No invoices yet. Create your first one!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

// --- MAIN ENTRY POINT ---
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
        
        {/* PROTECTED ROUTES */}
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