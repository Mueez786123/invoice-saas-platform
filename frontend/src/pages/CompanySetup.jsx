import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CompanySetup = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('access')
    
    const [formData, setFormData] = useState({
        company_name: '',
        company_address: '',
        company_email: '',
        company_phone: '',
        bank_name: '',
        account_number: '',
        ifsc_code: ''
    })
    const [loading, setLoading] = useState(true)

    // ✅ FIXED: Try-Catch block added to handle errors properly
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                
                if (response.ok) {
                    const data = await response.json()
                    // Agar company_name hai, toh form bhar do
                    if (data.company_name) {
                        setFormData({
                            company_name: data.company_name || '',
                            company_address: data.company_address || '',
                            company_email: data.company_email || '',
                            company_phone: data.company_phone || '',
                            bank_name: data.bank_name || '',
                            account_number: data.account_number || '',
                            ifsc_code: data.ifsc_code || ''
                        })
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            } finally {
                // ✅ Loading hamesha false hoga, chahe error aaye ya success
                setLoading(false)
            }
        }
        fetchProfile()
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                method: 'PUT', // ✅ PUT request to Update
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                alert("Company Setup Complete! 🚀")
                navigate('/') // Dashboard par jao
            } else {
                alert("Error saving details. Please try again.")
            }
        } catch (error) {
            console.error("Error saving:", error)
            alert("Network Error. Is backend running?")
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    // Loading State UI
    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-xl font-bold text-blue-600">Loading your profile...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-2 text-blue-700">Company Setup</h1>
                <p className="text-gray-500 mb-6">Enter your business details used for invoices.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Basic Info */}
                    <div className="col-span-2">
                        <label className="block text-sm font-bold mb-1">Company Name</label>
                        <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="e.g. LeadsByTech" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold mb-1">Address</label>
                        <textarea name="company_address" value={formData.company_address} onChange={handleChange} className="w-full border p-2 rounded" required placeholder="Full office address" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Business Email</label>
                        <input name="company_email" value={formData.company_email} onChange={handleChange} className="w-full border p-2 rounded" required type="email" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Phone</label>
                        <input name="company_phone" value={formData.company_phone} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    {/* Bank Details */}
                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Bank Details (For Invoice)</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Bank Name</label>
                        <input name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Account Number</label>
                        <input name="account_number" value={formData.account_number} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold mb-1">IFSC / SWIFT Code</label>
                        <input name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} className="w-full border p-2 rounded" />
                    </div>

                    <div className="col-span-2 mt-6">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">
                            Save & Continue to Dashboard →
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CompanySetup