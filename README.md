# Post-Quantum FIDO2 Authentication System

A modern web application implementing post-quantum cryptography enhanced FIDO2 authentication with a beautiful dark theme interface.

## 🚀 Features

- **Post-Quantum Cryptography**: CRYSTALS Dilithium integration for quantum-resistant authentication
- **Hybrid Security**: Combines RSA and Dilithium signatures for maximum security
- **Modern UI**: Dark theme interface matching the provided design references
- **WebAuthn Support**: Full FIDO2 WebAuthn API integration
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Progress**: Step-by-step authentication progress indicators

## 🎨 Design Features

Based on the provided design references, the application includes:

1. **Landing Page**: Introduction to Post-Quantum Cryptography with 3 informational cards
2. **Authentication Page**: Clean tabbed interface for registration and login
3. **Progress Tracking**: Real-time authentication progress with checkmarks
4. **Dashboard**: Protected data display with security details
5. **Dark Theme**: Modern black background with blue accents

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security**
- **H2 Database** (in-memory, no password required)
- **Maven** for dependency management

### Frontend
- **React 18**
- **React Router** for navigation
- **Styled Components** for styling
- **Framer Motion** for animations
- **React Toastify** for notifications

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd post-quantum-fido2
```

### 2. Start the Backend
```bash
# Compile the project
mvn clean compile

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Start the Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## 🌐 Application Flow

### 1. Landing Page (`/`)
- Introduction to Post-Quantum Cryptography
- Three informational cards explaining the problem, solution, and hybrid approach
- "Start Application" button to proceed to authentication

### 2. Authentication Page (`/auth`)
- **Register Tab**: User registration with username and email
- **Login Tab**: User login with username
- Real-time progress indicators during authentication
- Success confirmation with "Go to Dashboard" button

### 3. Dashboard (`/dashboard`)
- **Protected Data Section**: Displays user information and cryptographic keys
- **Security Details Section**: Shows hybrid key information and security levels
- **Access Data Button**: Simulates loading protected data
- **Logout Button**: Returns to landing page

## 🔐 Security Features

- **CRYSTALS Dilithium**: Post-quantum digital signatures
- **RSA Integration**: Classical cryptography for backward compatibility
- **Hybrid Approach**: Combines both classical and post-quantum methods
- **WebAuthn Compliance**: Standard FIDO2 authentication
- **Token-based Sessions**: JWT tokens for session management

## 🎯 Key Components

### Backend Components
- `DilithiumCryptoService`: Handles Dilithium cryptographic operations
- `Fido2Service`: Manages FIDO2 registration and authentication
- `AuthController`: REST API endpoints for authentication
- `SecurityConfig`: Spring Security configuration

### Frontend Components
- `LandingPage`: Introduction and welcome screen
- `AuthPage`: Registration and login interface
- `Dashboard`: Protected user dashboard
- `webauthnService`: WebAuthn API integration

## 🔧 Configuration

### Database Configuration
The application uses H2 in-memory database by default (no password required). To switch to MySQL:

1. Update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/post_quantum_fido2?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: your_password
```

2. Add MySQL dependency to `pom.xml`:
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

### Frontend Configuration
Update `frontend/src/services/api.js` to change the backend URL:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
```

## 🧪 Testing

### Backend Tests
```bash
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Browser Support

- Chrome 67+
- Firefox 60+
- Safari 14+
- Edge 79+

**Note**: WebAuthn requires HTTPS in production. For local development, use `http://localhost` or `http://127.0.0.1`.

## 🚨 Troubleshooting

### Common Issues

1. **WebAuthn Not Supported**: The application includes a demo mode for browsers without WebAuthn support
2. **CORS Errors**: Ensure the backend is running on port 8080
3. **Database Connection**: H2 database is in-memory, so data is lost on restart

### Debug Mode
Enable debug logging by adding to `application.yml`:
```yaml
logging:
  level:
    com.pqc.fido2: DEBUG
```

## 📄 API Endpoints

### Authentication
- `POST /auth/register/start` - Start user registration
- `POST /auth/register/finish` - Complete user registration
- `POST /auth/login/start` - Start user authentication
- `POST /auth/login/finish` - Complete user authentication
- `GET /auth/health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- CRYSTALS Dilithium for post-quantum cryptography
- Spring Boot for the backend framework
- React for the frontend framework
- WebAuthn specification for authentication standards