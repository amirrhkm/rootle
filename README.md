# 🌿 Rootle
### *The Modern AWS Command Center That Actually Makes Sense*

<div align="center">

![Rootle Logo](https://img.shields.io/badge/🌿-Rootle-teal?style=for-the-badge&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![AWS](https://img.shields.io/badge/AWS-Ready-orange?style=for-the-badge&logo=amazon-aws)

*Where AWS management meets beautiful design and developer happiness* ✨

</div>

---

## 🚀 **What is Rootle?**

Rootle isn't just another AWS dashboard—it's a **revolution** in cloud management. Built for developers who refuse to settle for ugly interfaces and confusing workflows, Rootle transforms AWS operations into an intuitive, beautiful experience.

### **Why Rootle?** 🤔
- **🎨 Gorgeous UI**: Dark mint gradients that don't hurt your eyes at 3 AM
- **🔐 Multi-Profile Mastery**: Switch between AWS accounts faster than you can say "IAM"
- **⚡ Lightning Fast**: Built with modern tech that actually performs
- **🧠 Developer-First**: Made by developers, for developers who value their sanity

---

## ✨ **Features That'll Blow Your Mind**

### 🔑 **AWS Profile Management**
- **Multiple Profile Support**: Manage unlimited AWS accounts with style
- **Real-time Validation**: Know instantly if your credentials work
- **Secure Storage**: Your secrets stay secret (locally stored, never transmitted)
- **Visual Indicators**: Always know which profile is active

### 🎯 **Modern Dashboard**
- **Glass-morphism Design**: Because flat design is so 2015
- **Responsive Layout**: Looks stunning on everything from phones to ultrawide monitors
- **Dark Mint Theme**: Easy on the eyes, easy on the soul
- **Intuitive Navigation**: Find what you need without a PhD in AWS

### 🛠 **Developer Experience**
- **TypeScript Everything**: Type safety that prevents 3 AM production incidents
- **Hot Reload**: Changes appear faster than your coffee gets cold
- **Modern Stack**: Built with the latest and greatest tech
- **Clean Architecture**: Code so clean you could eat off it

---

## 🏗 **Repository Structure**

```
rootle/
├── 🎯 frontend/                 # Next.js React Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── aws-profiles/    # AWS Profile Management
│   │   │   ├── settings/        # Application Settings
│   │   │   └── layout.tsx       # Root Layout
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── ui/              # Core UI Library
│   │   │   └── navigation-menu.tsx
│   │   ├── contexts/            # React Context Providers
│   │   │   └── AWSProfileContext.tsx
│   │   ├── types/               # TypeScript Definitions
│   │   │   └── aws.ts
│   │   └── lib/                 # Utilities & API Clients
│   ├── package.json
│   └── tailwind.config.ts       # Styling Configuration
│
├── ⚡ backend/                  # Express.js API Server
│   ├── src/
│   │   └── server.ts            # Main Server & AWS Integration
│   ├── package.json
│   └── tsconfig.json
│
├── 📋 .gitignore                # Git Ignore Rules
└── 📖 README.md                 # This Beautiful Documentation
```

### **Architecture Philosophy** 🏛
- **Frontend**: React/Next.js for blazing-fast user experience
- **Backend**: Express.js for rock-solid API performance  
- **State Management**: React Context for clean, predictable data flow
- **Styling**: Tailwind CSS for rapid, consistent design
- **Type Safety**: TypeScript everywhere because bugs are for other projects

---

## 🚀 **Quick Start Guide**

### **Prerequisites** 📋
- **Node.js** 18+ (because we live in the future)
- **npm** or **yarn** (your choice, we don't judge)
- **AWS Account** (obviously)
- **A desire for beautiful software** ✨

### **Installation** ⚙️

```bash
# Clone this masterpiece
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

### **Environment Setup** 🌍

Create a `.env` file in the backend directory:
```env
PORT=3001
# Add any other environment variables as needed
```

### **First Run** 🎉
1. **Backend**: Runs on `http://localhost:3001`
2. **Frontend**: Runs on `http://localhost:3000`
3. **Magic**: Happens when you visit the frontend URL

---

## 🛠 **Development Guide**

### **Getting Started** 🏁
1. **Fork & Clone**: Make it yours
2. **Install Dependencies**: `npm install` in both directories
3. **Start Development**: Run both frontend and backend
4. **Create Magic**: Build something amazing

### **Project Standards** 📏
- **Code Style**: Prettier + ESLint (because consistency matters)
- **Commits**: Descriptive messages that tell a story
- **Components**: Small, focused, and reusable
- **Types**: Everything typed, nothing `any`

### **Development Workflow** 🔄
```bash
# Start backend development server
cd backend && npm run dev

# Start frontend development server (new terminal)
cd frontend && npm run dev

# Build for production
npm run build    # in respective directories
```

### **Adding New Features** 🎯
1. **Create Types**: Define TypeScript interfaces first
2. **Build Backend**: Add API endpoints as needed
3. **Design Frontend**: Create beautiful, functional UI
4. **Test Everything**: Because working software > broken dreams

---

## 🎨 **Design Philosophy**

### **Color Palette** 🎭
- **Primary**: Dark mint gradients that soothe the developer soul
- **Secondary**: Teal accents that pop without screaming
- **Neutral**: Sophisticated grays that never go out of style

### **UI Principles** 🎯
- **Glass-morphism**: Semi-transparent backgrounds with blur effects
- **Gradients**: Subtle, beautiful color transitions
- **Micro-interactions**: Smooth animations that feel natural
- **Responsive**: Looks perfect on every device ever made

---

## 🤝 **Contributing**

Want to make Rootle even more amazing? We'd love your help!

### **How to Contribute** 💪
1. **Fork the repository** (make it yours)
2. **Create a feature branch** (`feature/amazing-new-thing`)
3. **Make your changes** (add that magic touch)
4. **Test everything** (because broken features make sad developers)
5. **Submit a pull request** (share the love)

### **Contribution Guidelines** 📋
- **Code Quality**: Write code you'd be proud to show your grandmother
- **Documentation**: Update docs if you change functionality
- **Design Consistency**: Follow the established design patterns
- **Have Fun**: If you're not enjoying it, you're doing it wrong

---

## 📱 **Screenshots**

*Coming soon: Screenshots so beautiful they'll make you cry tears of joy*

---

## 🔮 **Roadmap**

### **Phase 1: Foundation** ✅
- [x] AWS Profile Management
- [x] Beautiful Dashboard UI
- [x] Modern Tech Stack

### **Phase 2: Power Features** 🚧
- [ ] IAM Users and Permissions
- [ ] Lambdas Manual Trigger
- [ ] S3 Bucket Operations
- [ ] CloudWatch Monitoring

### **Phase 3: Enterprise** 🎯
- [ ] Team Collaboration
- [ ] Advanced Security Features
- [ ] Custom Dashboards
- [ ] API Integration Framework

---

## 🙏 **Acknowledgments**

- **AWS**: For creating the cloud we all love to manage
- **Next.js Team**: For making React development actually enjoyable
- **Tailwind CSS**: For making CSS fun again
- **The Developer Community**: For inspiring us to build better tools

---

<div align="center">

### **Built with ❤️ and probably too much coffee** ☕

*Made by developers, for developers who refuse to settle for mediocrity*

**[⭐ Star this repo](https://github.com/your-username/rootle)** if Rootle made your AWS life better!

</div>

---

*"In a world full of boring AWS dashboards, be a Rootle." - Anonymous Developer* 