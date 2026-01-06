import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lectureRoutes from './routes/lectures.js';
import instructorRoutes from './routes/instructors.js';

const app = express();

/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* =========================
   ✅ CORS CONFIG (FINAL FIX)
========================= */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // Allow localhost (development)
      if (origin.startsWith('http://localhost')) {
        return callback(null, true);
      }

      // ✅ Allow ALL Netlify URLs (production + deploy previews)
      if (origin.endsWith('.netlify.app')) {
        return callback(null, true);
      }

      // Block everything else
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight (IMPORTANT)
app.options('*', cors());

/* =========================
   STATIC FILES
========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/instructors', instructorRoutes);

/* =========================
   ROOT ROUTE
========================= */
app.get('/', (req, res) => {
  res.json({ message: 'Lecture Scheduling API is running 🚀' });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for localhost and *.netlify.app`);
});
