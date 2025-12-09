# Prashikshan - Internship Platform

A comprehensive internship management platform connecting students, colleges, and employers.

## 🚀 Features

### For Students
- Browse and apply for internships
- Track application status
- Auto-generated logbooks
- Certificate and credit management
- Career counseling and learning resources

### For Employers
- Post internships with easy interface
- Manage and analyze applicants
- Review student logbooks
- Generate reports

### For College Admins
- Manage all students
- Track internship progress
- Approve applications
- Verify certificates and credits

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT with refresh tokens

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
PORT=5000
NODE_ENV=development
```

Run migrations:
```bash
npm run db:migrate:dev
```

Start server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start development server:
```bash
npm run dev
```

## 🌐 Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Prashiskshan-main/
├── backend/
│   ├── src/
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── validation/     # Zod schemas
│   │   └── server.ts       # Express server
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── lib/           # API client & utilities
│   │   └── styles/        # Global styles
│   └── package.json
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication with:
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Role-based access control (Student, Company, Admin)

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Internships
- `GET /internships` - Get all internships
- `GET /internships/:id` - Get internship by ID
- `POST /internships` - Create internship (Company/Admin)
- `PUT /internships/:id` - Update internship
- `DELETE /internships/:id` - Delete internship

### Applications
- `POST /applications` - Apply for internship (Student)
- `GET /applications` - Get user's applications
- `PUT /company/applications/:id` - Update application status

### Logbooks
- `GET /logbooks` - Get user's logbooks
- `POST /logbooks` - Create logbook entry
- `DELETE /logbooks/:id` - Delete logbook entry

## 🧪 Development

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Development Team

## 📞 Support

For issues and questions, please contact the development team.

---

**Note**: This is a development version. Production deployment requires additional configuration and security measures.

