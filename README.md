# 🚀 SaaS Invoice Platform (Full-Stack)

A modern, production-ready SaaS application for managing invoices, clients, and billing automation. Built with **Django REST Framework** and **React**, featuring professional PDF generation and email automation.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_Django-orange)

---

## 🌟 Key Features

### 🏢 Agency & Profile Management
- **Dynamic Company Setup:** Users can configure their business profile (Logo, Address, Contact Info) which automatically reflects on all invoices.
- **Bank Details Integration:** Add bank account details (IFSC, Account No.) once, and they appear on every generated PDF.

### 🧾 Professional Invoice Generation
- **Automated PDF Engine:** Generates high-quality, printable PDF invoices using `xhtml2pdf`.
- **Modern Design:** Features a professional layout with branded headers, rupee symbol (₹) support, and clean typography.
- **Dynamic Line Items:** Add unlimited services/products with automatic total and tax calculations.
- **Status Tracking:** Visual badges for "Paid" and "Payment Pending" statuses.

### 📧 Communication & Automation
- **One-Click Email:** Send invoices directly to clients' email addresses with the PDF attached instantly from the dashboard.
- **Client Management:** Database to store and manage client details for recurring billing.

### 🔐 Security & Authentication
- **Secure Auth:** JWT (JSON Web Token) based Login and Registration.
- **Password Recovery:** Full "Forgot Password" flow with secure email token verification.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, React Router DOM |
| **Backend** | Python, Django, Django REST Framework (DRF) |
| **Database** | SQLite (Dev) / PostgreSQL (Production Ready) |
| **PDF Engine** | xhtml2pdf (HTML/CSS to PDF conversion) |
| **Authentication** | Simple JWT |
| **Email Service** | Django Core Mail (SMTP) |

---

## 📸 Screenshots

*(Add your project screenshots here)*

| Dashboard UI | Generated PDF Invoice |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard+Preview) | ![Invoice](https://via.placeholder.com/400x200?text=PDF+Invoice+Preview) |

---

## 🚀 Installation & Setup Guide

Follow these steps to run the project locally on your machine.

### Prerequisites
- Python 3.10+
- Node.js & npm

### 1️⃣ Backend Setup (Django)

```bash
# Clone the repository
git clone [https://github.com/Mueez786123/invoice-saas-platform.git](https://github.com/Mueez786123/invoice-saas-platform.git)
cd invoice-saas-platform/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Start Server
python manage.py runserver
```

### 2️⃣ Frontend Setup (React)
```bash
Open a new terminal and navigate to the frontend folder.
cd invoice-saas-platform/frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```

### 📡 API Endpoints Overview

Method,Endpoint,Description
POST,/api/token/,User Login (Get JWT Token)
POST,/api/register/,New User Registration
GET,/api/invoices/,Fetch all user invoices
POST,/api/invoices/,Create a new invoice
GET,/api/invoices/{id}/download/,Download Invoice PDF
POST,/api/invoices/{id}/send_email/,Email Invoice to Client
PUT,/api/profile/,Update Company & Bank Details
POST,/api/password-reset/,Request Password Reset Link

## 👤 Author
Mueezur Rehman Full Stack Developer | Founder at LeadsByTech.com and Co-founder of Upyourlead.com
LinkedIn: (https://www.linkedin.com/in/mueezurrehman/)
Email: mueez@upyourlead.com
Portfolio: mueez-portfolio.netlify.app

# Note to Recruiters: 
This project demonstrates end-to-end full stack development skills including database modeling, complex PDF generation logic, secure authentication flows, and third-party email integration.