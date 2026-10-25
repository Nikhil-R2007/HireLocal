# HireLocal — Connecting People with Local Talent

<p align="center">
  <strong>Discover local workers. Connect with skilled professionals. Simplify hiring.</strong>
</p>

<p align="center">
  A web application designed to help users discover local workers, explore profiles, manage job requests, and coordinate bookings through one platform.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Backend%20Services-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Node.js-Server-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

---

## 📌 Overview

**HireLocal** is a local hiring platform built to make it easier for customers to find workers based on their needs and for workers to manage their professional profiles and job opportunities.

The project combines a React-based user interface with a Node.js and Express server, Firebase integration, and AI-related functionality.

### ✨ Key Features

- **Worker Discovery** — Explore local workers and search based on skills.
- **Worker Profiles** — View and manage professional profile information.
- **Authentication** — Authentication interface and Firebase integration.
- **User Dashboard** — Access the application's dashboard and navigation.
- **Job Requests** — View and manage job-related requests.
- **Bookings** — Dedicated booking management interface.
- **Real-Time Communication** — Chat interface for user communication.
- **AI Assistant** — AI-related assistance integrated into the application.
- **Location Integration** — Google Maps integration support.
- **Security Rules** — Firebase Firestore rules for data access control.

> Note: Feature availability and backend integration depend on the current implementation and configuration.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe application development |
| Vite | Development server and frontend build |
| Tailwind CSS | UI styling |
| Node.js | JavaScript runtime |
| Express.js | HTTP server and API endpoints |
| Firebase Authentication | Authentication integration |
| Cloud Firestore | Database integration |
| Google Maps Platform | Location-based functionality |
| Google GenAI SDK | AI integration |
| React Router | Client-side navigation |
| Lucide React | Icons |

## 📂 Project Structure

```text
HireLocal/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── AIAssistant.tsx
│   │   └── DashboardLayout.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── ai.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── HomeDashboard.tsx
│   │   ├── WorkerDiscovery.tsx
│   │   ├── WorkerProfilePage.tsx
│   │   ├── WorkerDashboard.tsx
│   │   ├── WorkerJobs.tsx
│   │   ├── JobRequests.tsx
│   │   ├── BookingsPage.tsx
│   │   ├── ChatPage.tsx
│   │   └── ProfilePage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── server.ts
├── firestore.rules
├── DRAFT_firestore.rules
├── firebase-applet-config.json
├── firebase-blueprint.json
├── metadata.json
├── security_spec.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) — use a compatible LTS version.
- npm — included with Node.js.
- A Firebase project for Firebase-dependent features.
- Appropriate API credentials for any enabled AI or Maps integrations.

### 1. Clone the repository

```bash
git clone https://github.com/Nikhil-R2007/HireLocal.git
cd HireLocal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file based on `.env.example`.

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Configure the required values in `.env` according to the integrations used by your application.

Typical variables include:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
VITE_GOOGLE_MAPS_PLATFORM_KEY=your_maps_api_key
```

Use real credentials only in your local environment or your deployment platform's secret manager. Never commit `.env` or private credentials to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the local address:

```text
http://localhost:3000
```

The current Express server integrates Vite middleware for development.

## 🧪 Development Commands

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the Express and Vite development server |
| `npm run build` | Build the frontend using Vite |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Run the configured TypeScript checks |

## 🔐 Security

Security is an important part of a platform that handles user profiles, job requests, bookings, and messages.

- Keep private credentials out of source code.
- Store sensitive server-side keys in environment variables.
- Configure Firebase Authentication and Firestore Security Rules appropriately.
- Restrict Google API keys to the required APIs and application domains.
- Validate authorization on the server and in database security rules.
- Never rely on frontend checks alone to protect private data.

The repository includes `firestore.rules` and `security_spec.md` for security-related configuration and planning.

**Before production deployment:** Review the rules, test authorization boundaries, and verify that no exposed credentials remain active.

## 🌱 Future Improvements

Potential improvements include:

- More advanced skill-based and location-based worker matching.
- Improved booking and job-request workflows.
- Notifications for booking updates and new job requests.
- Enhanced worker verification and profile quality.
- Automated security and application testing.
- Production deployment with environment-specific configuration.
- Better accessibility and mobile responsiveness.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application.
5. Submit a pull request with a clear description.

## 👨‍💻 Author

**Nikhil R.**

- GitHub: [@Nikhil-R2007](https://github.com/Nikhil-R2007)
- Project: [HireLocal](https://github.com/Nikhil-R2007/HireLocal)

---

<p align="center">
  Built to make local hiring and worker discovery simpler.
</p>
