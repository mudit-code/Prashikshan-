# Frontend-Backend Connection Guide

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd Prashiskshan-main/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```env
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
PORT=5000
NODE_ENV=development
```

4. Run database migrations:
```bash
npm run db:migrate:dev
```

5. Seed roles (if not already done):
```bash
# You can use the /seed endpoint or run the seed script
```

6. Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Prashiskshan-main/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (if not exists):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## API Endpoints Connected

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Internships
- `GET /internships` - Get all internships (public)
- `GET /internships/:id` - Get internship by ID
- `POST /internships` - Create internship (Company/Admin only)
- `PUT /internships/:id` - Update internship (Company/Admin only)
- `DELETE /internships/:id` - Delete internship (Company/Admin only)
- `GET /company/internships` - Get company's internships
- `GET /company/internships/:id/applications` - Get applications for internship

### Applications
- `POST /applications` - Create application (Student only)
- `GET /applications` - Get student's applications
- `PUT /company/applications/:id` - Update application status (Company only)

### Logbooks
- `GET /logbooks` - Get student's logbooks
- `POST /logbooks` - Create logbook entry (Student only)
- `DELETE /logbooks/:id` - Delete logbook entry
- `GET /logbooks/:id/export` - Export logbook
- `GET /company/logbooks/:studentId` - Get student logbooks (Company only)

## Role Mapping

- **Student** - Role ID: 1
- **Company** (Employer) - Role ID: 2
- **Admin** (College Admin) - Role ID: 3

## Testing the Connection

1. Start both backend and frontend servers
2. Visit `http://localhost:3000`
3. Try registering a new account
4. Login with the registered account
5. Navigate to the appropriate dashboard based on your role

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure the backend has CORS enabled (it should be enabled by default in the server.ts file).

### Authentication Issues
- Check that JWT_SECRET and REFRESH_TOKEN_SECRET are set in backend .env
- Verify that tokens are being stored in localStorage (check browser DevTools)
- Check backend logs for authentication errors

### API Connection Issues
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in frontend .env.local
- Check browser console for API errors
- Verify network tab in browser DevTools for failed requests

## Next Steps

1. Update employer dashboard to fetch real data
2. Update admin dashboard to fetch real data
3. Add more API endpoints as needed (credits, certificates, etc.)
4. Implement real-time features if needed
5. Add error boundaries and better error handling

