# 🌿 Rootle

<div align="center">

*AWS Management Platform*

![Rootle Logo](https://img.shields.io/badge/🌿-Rootle-teal?style=for-the-badge&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![AWS](https://img.shields.io/badge/AWS-Ready-orange?style=for-the-badge&logo=amazon-aws)

*Personalised AWS management platform built for developers*

</div>

---

## Overview

Rootle is a comprehensive AWS management platform designed to streamline cloud operations. Built with modern web technologies, it provides an efficient interface for managing multiple AWS accounts and services.

### Core Features
- **Multi-Account Management**: Seamless switching between AWS profiles
- **Real-time Validation**: Instant credential verification
- **Secure Local Storage**: Credentials stored locally, never transmitted
- **Responsive Interface**: Optimized for desktop and mobile devices
- **TypeScript Implementation**: Full type safety across the application

---

## Technical Features

### AWS Profile Management
- **Multiple Profile Support**: Manage unlimited AWS accounts
- **Credential Validation**: Real-time verification of AWS credentials
- **Local Storage**: Secure credential management using browser storage
- **Profile Switching**: Instant context switching between accounts

### Dashboard Interface
- **Glass-morphism Design**: Modern UI with semi-transparent elements
- **Responsive Layout**: Adaptive design for various screen sizes
- **Dark Theme**: Optimized for extended development sessions
- **Intuitive Navigation**: Streamlined access to AWS services

### Development Experience
- **TypeScript**: Comprehensive type safety throughout the codebase
- **Hot Reload**: Fast development iteration cycles
- **Modern Architecture**: Clean separation of concerns
- **Component-Based**: Reusable UI components

---

## Architecture

```
rootle/
├── frontend/                    # Next.js React Application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── aws-profiles/   # AWS Profile Management
│   │   │   ├── settings/       # Application Settings
│   │   │   └── layout.tsx      # Root Layout
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── ui/             # Core UI Library
│   │   │   └── navigation-menu.tsx
│   │   ├── contexts/           # React Context Providers
│   │   │   └── AWSProfileContext.tsx
│   │   ├── types/              # TypeScript Definitions
│   │   │   └── aws.ts
│   │   └── lib/                # Utilities & API Clients
│   ├── package.json
│   └── tailwind.config.ts      # Styling Configuration
│
├── backend/                     # Express.js API Server
│   ├── src/
│   │   └── server.ts           # Main Server & AWS Integration
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                   # Git Ignore Rules
└── README.md                    # Documentation
```

### Technology Stack
- **Frontend**: React/Next.js with TypeScript
- **Backend**: Express.js with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js built-in bundler

---

## Installation

### Prerequisites
- **Node.js** 20+ 
- **npm** or **yarn**
- **AWS Account**
- **Chrome, Firefox, or Edge** (Safari not supported for developers)

### Setup

```bash
# Clone repository
git clone https://github.com/amirrhkm/rootle.git
cd rootle

# Backend Setup
cd backend
npm install
npm run dev

# Frontend Setup (new terminal)
cd ../frontend
npm install
npm run dev
```

### Environment Configuration

Create a `.env` file in the backend directory:
```env
PORT=3001
# Additional environment variables as needed
```

### Development Servers
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:3000`

---

## Development

### Getting Started
1. **Fork & Clone**: Create your own repository
2. **Install Dependencies**: `npm install` in both directories
3. **Start Development**: Run both frontend and backend servers
4. **Begin Development**: Start building features

### Code Standards
- **Linting**: ESLint + Prettier configuration
- **Commits**: Conventional commit messages
- **Components**: Modular, reusable architecture
- **Types**: Strict TypeScript configuration

### Development Workflow
```bash
# Start backend development server
cd backend && npm run dev

# Start frontend development server (new terminal)
cd frontend && npm run dev

# Build for production
npm run build    # in respective directories
```

---

## Browser Compatibility

### Supported Browsers
- **Chrome**: Full support
- **Firefox**: Full support  
- **Edge**: Full support

### Not Supported
- **Safari**: Limited support for developers due to Web API differences

---

## Design System

### Color Scheme
- **Primary**: Dark mint gradients
- **Secondary**: Teal accents
- **Neutral**: Gray scale palette

### UI Principles
- **Glass-morphism**: Semi-transparent backgrounds with blur effects
- **Gradients**: Subtle color transitions
- **Animations**: Smooth micro-interactions
- **Responsive**: Mobile-first design approach

---

## Contributing

### Development Guidelines
1. **Fork the repository**
2. **Create feature branch** (`feature/feature-name`)
3. **Implement changes**
4. **Test thoroughly**
5. **Submit pull request**

### Contribution Standards
- **Code Quality**: Maintain high code standards
- **Documentation**: Update documentation for new features
- **Design Consistency**: Follow established patterns
- **Testing**: Include appropriate tests

---

## Screenshots

<img width="1197" height="654" alt="Dashboard" src="https://github.com/user-attachments/assets/5a6778e4-df61-40d0-a470-da7ac3e1a0e9" />
<img width="1197" height="654" alt="Upload" src="https://github.com/user-attachments/assets/59a0bec4-63c1-4843-90c8-79c2e124b59f" />
<img width="1197" height="654" alt="History" src="https://github.com/user-attachments/assets/95f24317-d479-4f0b-8a1d-6dc76f030f58" />
<img width="1197" height="654" alt="View" src="https://github.com/user-attachments/assets/1f8585ad-c93e-43b9-97f5-220563025f86" />

---

## Roadmap

### Phase 1: Foundation ✅
- [x] AWS Profile Management
- [x] Dashboard Interface
- [x] Core Architecture

### Phase 2: Enhanced Features 🚧
- [ ] IAM User Management
- [ ] Lambda Function Triggers
- [x] S3 Bucket Operations
- [ ] CloudWatch Integration

---

## Acknowledgments

- **AWS**: Cloud infrastructure platform
- **Next.js**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Developer Community**: Open source contributions

---

<div align="center">

### Built with modern web technologies

*AWS management platform for developers*

**[⭐ Star this repository](https://github.com/your-username/rootle)** if Rootle helps with your AWS workflow

</div>

---

*"Efficient AWS management for modern development teams"* 
