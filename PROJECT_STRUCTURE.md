# Post-Quantum FIDO2 Project Structure

## 📁 Project Overview

```
post-quantum-fido2/
├── 📁 src/main/java/com/pqc/fido2/          # Backend Java source code
├── 📁 src/main/resources/                   # Backend configuration files
├── 📁 frontend/                             # React frontend application
├── 📄 pom.xml                              # Maven project configuration
├── 📄 README.md                            # Project documentation
└── 📄 PROJECT_STRUCTURE.md                 # This file
```

## 🔧 Backend Structure (Spring Boot)

### Core Application
```
src/main/java/com/pqc/fido2/
├── PostQuantumFido2Application.java        # Main Spring Boot application class
├── 📁 config/                              # Configuration classes
│   └── SecurityConfig.java                 # Security and CORS configuration
├── 📁 controller/                          # REST API controllers
│   └── AuthController.java                 # Authentication endpoints
├── 📁 crypto/                              # Post-quantum cryptography implementation
│   ├── DilithiumCryptoService.java         # Core Dilithium operations
│   ├── MLDilithiumService.java             # Multi-layered Dilithium service
│   ├── DilithiumKeyPair.java               # Key pair representation
│   ├── DilithiumPublicKey.java             # Public key implementation
│   ├── DilithiumPrivateKey.java            # Private key implementation
│   ├── DilithiumSignature.java             # Signature representation
│   ├── MLDilithiumKeyPair.java             # Multi-layered key pair
│   ├── MLDilithiumPublicKey.java           # Multi-layered public key
│   ├── MLDilithiumPrivateKey.java          # Multi-layered private key
│   ├── MLDilithiumSignature.java           # Multi-layered signature
│   └── HybridSignature.java                # Hybrid signature implementation
├── 📁 dto/                                 # Data Transfer Objects
│   ├── RegistrationRequest.java            # Registration request DTO
│   ├── RegistrationResponse.java           # Registration response DTO
│   ├── AuthenticationRequest.java          # Authentication request DTO
│   └── AuthenticationResponse.java         # Authentication response DTO
├── 📁 model/                               # JPA entities
│   ├── User.java                           # User entity
│   ├── Credential.java                     # FIDO2 credential entity
│   └── AuthenticationSession.java          # Authentication session entity
├── 📁 repository/                          # Data access layer
│   ├── UserRepository.java                 # User data access
│   ├── CredentialRepository.java           # Credential data access
│   └── AuthenticationSessionRepository.java # Session data access
└── 📁 service/                             # Business logic layer
    ├── UserService.java                    # User management service
    └── Fido2Service.java                   # FIDO2 authentication service
```

### Configuration Files
```
src/main/resources/
└── application.yml                         # Application configuration
```

## 🎨 Frontend Structure (React)

### Core Application
```
frontend/
├── 📁 public/                              # Static assets
│   ├── index.html                          # Main HTML template
│   └── manifest.json                       # Web app manifest
├── 📁 src/                                 # React source code
│   ├── App.js                              # Main React component
│   ├── index.js                            # React entry point
│   ├── index.css                           # Global styles
│   ├── 📁 components/                      # React components
│   │   ├── Login.js                        # Login page component
│   │   ├── Register.js                     # Registration page component
│   │   ├── Dashboard.js                    # Dashboard page component
│   │   ├── Header.js                       # Header navigation component
│   │   └── 📁 styled/                      # Styled components
│   │       └── Common.js                   # Common styled components
│   ├── 📁 context/                         # React context providers
│   │   └── AuthContext.js                  # Authentication context
│   └── 📁 services/                        # API and utility services
│       ├── api.js                          # API service layer
│       └── webauthn.js                     # WebAuthn integration service
├── package.json                            # Node.js dependencies
└── README.md                               # Frontend documentation
```

## 🔐 Security Architecture

### Post-Quantum Cryptography Layer
- **DilithiumCryptoService**: Core Dilithium operations (key generation, signing, verification)
- **MLDilithiumService**: Multi-layered signature algorithm implementation
- **Hybrid Support**: Combines classical and post-quantum cryptography

### FIDO2 Integration
- **WebAuthn Service**: Browser WebAuthn API integration
- **Credential Management**: Secure credential storage and retrieval
- **Biometric Support**: Platform authenticator integration

### Authentication Flow
1. **Registration**: User creates account → WebAuthn credential creation → Post-quantum key generation
2. **Authentication**: User login → WebAuthn assertion → Signature verification
3. **Session Management**: Secure session handling with timeout

## 🗄️ Database Schema

### Tables
- **users**: User account information
- **credentials**: FIDO2 credential storage
- **authentication_sessions**: Challenge and session management

### Key Fields
- **User**: id, username, email, displayName, createdAt, lastLogin, isActive
- **Credential**: id, credentialId, publicKey, pqPublicKey, signatureCount, cryptoType
- **AuthenticationSession**: id, sessionId, challenge, pqChallenge, expiresAt, authType

## 🚀 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register/begin` - Initiate registration
- `POST /api/auth/register/complete` - Complete registration
- `POST /api/auth/login/begin` - Initiate authentication
- `POST /api/auth/login/complete` - Complete authentication
- `GET /api/auth/health` - Health check

### Request/Response Flow
1. **Registration**: Client → Begin Registration → WebAuthn → Complete Registration → Success
2. **Authentication**: Client → Begin Authentication → WebAuthn → Complete Authentication → Success

## 🛠️ Development Workflow

### Backend Development
1. Modify Java classes in `src/main/java/com/pqc/fido2/`
2. Update configuration in `src/main/resources/application.yml`
3. Run with `mvn spring-boot:run`
4. Access H2 console at `http://localhost:8080/h2-console`

### Frontend Development
1. Modify React components in `frontend/src/`
2. Update styles in `frontend/src/components/styled/`
3. Run with `npm start` in frontend directory
4. Access at `http://localhost:3000`

### Testing
- **Backend**: `mvn test`
- **Frontend**: `npm test` in frontend directory

## 📦 Dependencies

### Backend Dependencies (Maven)
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- H2 Database
- BouncyCastle (Post-quantum crypto)
- Jackson (JSON processing)

### Frontend Dependencies (NPM)
- React 18
- React Router DOM
- Styled Components
- Framer Motion
- Axios
- React Hook Form
- React Toastify
- Lucide React (Icons)

## 🔧 Configuration

### Backend Configuration
- **Port**: 8080
- **Database**: H2 in-memory
- **CORS**: Enabled for localhost:3000
- **Security**: Stateless authentication

### Frontend Configuration
- **Port**: 3000
- **API URL**: http://localhost:8080/api
- **Proxy**: Configured for backend communication

## 🚀 Deployment

### Development
- Backend: `mvn spring-boot:run`
- Frontend: `npm start`

### Production
- Backend: Deploy JAR to cloud platform
- Frontend: Build and deploy to static hosting
- Database: Configure production database

## 📝 Key Features Implemented

✅ **Post-Quantum Cryptography**: CRYSTALS Dilithium integration
✅ **Multi-Layered Security**: ML-DSA implementation
✅ **Hybrid Authentication**: Classical + Post-quantum support
✅ **FIDO2 Compliance**: WebAuthn integration
✅ **Biometric Support**: Platform authenticator support
✅ **Modern UI**: React with styled components
✅ **RESTful API**: Spring Boot backend
✅ **Database Integration**: JPA with H2
✅ **Security Configuration**: CORS and authentication
✅ **Comprehensive Documentation**: README and structure docs
