import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateInvoice = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('access')
    
    // STATES
    const [clients, setClients] = useState([])
    const [selectedClient, setSelectedClient] = useState('')
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(false) // Loading indicator ke liye

    // Items State (Shuru mein ek khali row)
    const [items, setItems] = useState([
        { description: '', quantity: 1, unit_price: 0 }
    ])

    // Fetch Clients for Dropdown
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/clients/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if(res.status === 401) {
                alert("Session Expired! Please login again.")
                navigate('/login')
            }
            return res.json()
        })
        .then(data => {
            if(Array.isArray(data)) setClients(data)
        })
        .catch(err => console.error(err))
    }, [token, navigate])

    // --- LOGIC: ROW ADD/REMOVE ---
    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }])
    }

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
    }

    // --- LOGIC: INPUT CHANGE HANDLING ---
    const handleItemChange = (index, field, value) => {
        const newItems = [...items]
        newItems[index][field] = value
        setItems(newItems)
    }

    // --- LOGIC: AUTO CALCULATION ---
    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.unit_price), 0)
    }

    // --- LOGIC: SUBMIT TO BACKEND (The Real Deal) ---
    const handleSubmit = async () => {
        // Validation
        if (!selectedClient) {
            alert("Please select a client first!")
            return
        }

        setLoading(true) // Button ko disable kar do taaki user double click na kare

        const payload = {
            client: selectedClient,
            date: invoiceDate,
            items: items,
            // Subtotal aur Total hum backend par bhi calculate kar sakte hain, 
            // par abhi simplicity ke liye frontend se bhej rahe hain.
            subtotal: calculateTotal(), 
            total_amount: calculateTotal(), 
            tax_amount: 0 
        }
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/invoices/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                alert("Invoice Created Successfully! 🎉")
                navigate('/') // Wapas Dashboard par bhejo
            } else {
                const errorData = await response.json()
                console.error("Server Error:", errorData)
                alert("Failed to create invoice. API Error.")
            }
        } catch (error) {
            console.error("Network Error:", error)
            alert("Something went wrong! Check backend server.")
        } finally {
            setLoading(false) // Loading khatam
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                
                {/* HEADER */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-800">New Invoice</h1>
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* FORM AREA */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Select Client</label>
                        <select 
                            className="w-full p-2 border rounded"
                            onChange={(e) => setSelectedClient(e.target.value)}
                            value={selectedClient}
                        >
                            <option value="">-- Choose Client --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Invoice Date</label>
                        <input 
                            type="date" 
                            className="w-full p-2 border rounded"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <table className="w-full mb-6">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Description</th>
                            <th className="p-2 w-20">Qty</th>
                            <th className="p-2 w-32">Price (₹)</th>
                            <th className="p-2 w-32">Total</th>
                            <th className="p-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">
                                    <input 
                                        type="text" 
                                        placeholder="Item name"
                                        className="w-full p-1 border rounded"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    />
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" 
                                        className="w-full p-1 border rounded"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" 
                                        className="w-full p-1 border rounded"
                                        value={item.unit_price}
                                        onChange={(e) => handleItemChange(index, 'unit_price', Number(e.target.value))}
                                    />
                                </td>
                                <td className="p-2 font-mono">
                                    ₹{(item.quantity * item.unit_price).toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                    {items.length > 1 && (
                                        <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 font-bold">
                                            ×
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between items-center">
                    <button 
                        onClick={addItem}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        + Add Line Item
                    </button>
                    
                    <div className="text-right">
                        <h2 className="text-2xl font-bold mb-2">Total: ₹{calculateTotal().toFixed(2)}</h2>
                        <button 
                            onClick={handleSubmit}
                            disabled={loading} // Loading ke time click disable
                            className={`px-8 py-3 rounded-lg font-bold shadow-lg text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Saving...' : 'Save & Generate PDF'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreateInvoice