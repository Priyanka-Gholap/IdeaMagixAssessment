# IdeaMagixTask

A full-stack project containing a Vite + React frontend and an Express + Node backend.

This README explains the project structure, how to run the app locally, environment variables, and Netlify build settings for deploying the frontend.

## Project structure

- backend/ — Express API server
  - package.json (scripts: `start`, `dev`)
  - src/
    - server.js (entrypoint)

- frontend/my-app/ — Vite + React frontend
  - package.json (scripts: `dev`, `build`, `preview`)
  - src/
  - dist/ (generated after build)

## Technologies

- Frontend: React, Vite, Axios, React Router
- Backend: Node.js, Express, Mongoose (MongoDB), bcryptjs, jsonwebtoken

🔗 Live Links

Frontend: [https://ideamagix-assessement.netlify.app/](https://lecturesystem.netlify.app/)

Backend API: [https://ideatest-in0m.onrender.com](https://ideamagixassessment.onrender.com)

GitHub: (add your repo link here)

🧪 Test Credentials

Admin

Email: admin2@lecture.com

Password: admin123

Instructor

Email: instructor.demo@ideamagix.com

Password: Instructor123

## Prerequisites

- Node.js (v16+ recommended)
- npm
- A running MongoDB instance (local or hosted) if you use the backend

## Environment variables

Create a `.env` file in the backend/ directory with values such as:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

For the frontend, the app expects a client-accessible API URL. With Vite, environment variables that should be exposed to the browser must begin with `VITE_`.

Create a `.env` file in `frontend/my-app/` (or set environment variables in your host) with:

```
VITE_API_URL=https://your-backend-url.example.com
```

Note: If your code uses `REACT_APP_API_URL`, either change it to `VITE_API_URL` and use `import.meta.env.VITE_API_URL`, or set `REACT_APP_API_URL` in Netlify environment variables. Vite does not automatically expose `REACT_APP_` variables.

## Running locally

Backend:

```bash
cd backend
npm install
# development with auto-reload
npm run dev
# production
npm start
```

Frontend:

```bash
cd frontend/my-app
npm install
# dev server
npm run dev
# build for production
npm run build
# preview build locally
npm run preview
```

After starting both, make sure the frontend’s API URL points to the running backend (set `VITE_API_URL` accordingly).

## Netlify deployment (frontend only)

When configuring Netlify for this repository use these Build settings:

- Branch to deploy: `main`
- Base directory: `frontend/my-app`
- Build command: `npm run build`
- Publish directory: `dist`

Environment variables on Netlify:

- `VITE_API_URL` = `https://your-backend-url.example.com`
  (Or `REACT_APP_API_URL` if your frontend uses that naming, but `VITE_` prefix is recommended)

Notes:
- Netlify hosts static sites (the frontend). Deploy the backend separately (Render, Railway, Heroku, Fly.io, etc.) and point `VITE_API_URL` to the backend’s URL.
- If you need serverless functions, add them in a functions directory and set the "Functions directory" in Netlify settings.

## Build & test

- To verify the frontend build locally:

```bash
cd frontend/my-app
npm run build
# confirm dist/ contains files
ls dist
```

## Contributing

Contributions are welcome. Create issues or pull requests against the `main` branch. Describe your changes and include test steps.

## License

Add your preferred license here (e.g. MIT).


