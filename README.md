# The Barber Book - Appointment Management System

A modern, elegant barber shop website with appointment booking and admin management system.

## 🎨 Features

### Customer Features
- **Classic Barber Shop Design** - Elegant black, white, and gold theme
- **Service Booking** - Easy appointment scheduling with service selection
- **Real-time Availability** - See available time slots up to 2 weeks in advance
- **Service Customization** - Choose haircut + add-ons (design, beard trimming, eyebrows)
- **Booking Confirmation** - Detailed confirmation page with appointment details

### Admin Features
- **Secure Admin Login** - JWT-based authentication
- **Appointment Dashboard** - View, cancel, and reschedule appointments
- **Automatic Cleanup** - Past appointments automatically marked as completed
- **Manual Cleanup** - Button to manually mark past appointments as completed
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CSS3** - Custom styling with gradients and animations
- **Google Fonts** - Dancing Script for elegant typography

### Backend
- **ASP.NET Core 7.0** - High-performance web API
- **Entity Framework Core** - Database ORM
- **SQL Server** - Relational database
- **JWT Authentication** - Secure admin access
- **CORS** - Cross-origin resource sharing enabled

## 📁 Project Structure

```
TheBarberBook/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Site footer
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── BarberProfile.jsx # Barber information
│   │   ├── Services.jsx    # Service catalog
│   │   ├── Reviews.jsx     # Customer reviews
│   │   ├── Booker.jsx      # Appointment booking
│   │   ├── Confirmation.jsx # Booking confirmation
│   │   ├── AdminLogin.jsx  # Admin authentication
│   │   └── AdminDashboard.jsx # Admin management
│   └── css/                # Stylesheets
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- .NET 7.0 SDK
- SQL Server (LocalDB or SQL Server Express)

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone [https://github.com/codeus21/TheBarberBook]
   cd TheBarberBook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone [https://github.com/codeus21/BarberShopAPI]
   cd BarberShopAPI.Server
   ```

2. Set up user secrets:
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET_KEY"
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR_CONNECTION_STRING"
   ```

3. Run database migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the API:
   ```bash
   dotnet run
   ```

5. The API will be available at [https://localhost:7074](https://localhost:7074)

## 🔗 API Configuration

The frontend is configured to connect to:
- **Development**: `https://localhost:7074/api`
- **Production**: [Your production API URL when deployed]

## 📋 API Endpoints

### Public Endpoints
- `GET /api/Services` - Get all available services
- `POST /api/Appointments` - Create new appointment
- `GET /api/Appointments/available-slots` - Get available time slots

### Admin Endpoints (JWT Required)
- `POST /api/Auth/login` - Admin authentication
- `GET /api/Admin/appointments` - Get all appointments
- `PUT /api/Admin/appointments/{id}/cancel` - Cancel appointment
- `PUT /api/Admin/appointments/{id}/reschedule` - Reschedule appointment
- `POST /api/Admin/cleanup-completed` - Mark past appointments as completed

## 🎨 Design Features

- **Classic Barber Shop Aesthetic** - Black, white, and gold color scheme
- **Elegant Typography** - Dancing Script font for headers
- **Responsive Design** - Works on all device sizes
- **Smooth Animations** - Hover effects and transitions
- **Professional Layout** - Clean, organized interface

## 🔒 Security Features

- **JWT Authentication** - Secure admin access
- **User Secrets** - Sensitive data stored locally
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side data validation
- **SQL Injection Protection** - Entity Framework safeguards

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email [amazedave15@gmail.com] or create an issue in the repository.

---

**Built with ❤️ for barber shops everywhere**
