import express, { Request, Response } from 'express';
import pool from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Simple login (for demo purposes - no real auth)
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, role } = req.body;

        // If email provided, try to find existing user
        if (email) {
            const [users] = await pool.query<RowDataPacket[]>(
                'SELECT id, name, email, role FROM users WHERE email = ?',
                [email]
            );

            if (users.length > 0) {
                return res.json({
                    success: true,
                    user: users[0]
                });
            }
        }

        // Otherwise, return a demo user based on role
        const demoUsers: Record<string, { id: number; name: string; email: string; role: string }> = {
            'ATTENDEE': { id: 1, name: 'Demo Attendee', email: 'attendee@demo.com', role: 'ATTENDEE' },
            'ORGANIZER': { id: 2, name: 'Demo Organizer', email: 'organizer@demo.com', role: 'ORGANIZER' },
            'ADMIN': { id: 3, name: 'Demo Admin', email: 'admin@demo.com', role: 'ADMIN' }
        };

        const userRole = role || 'ATTENDEE';
        res.json({
            success: true,
            user: demoUsers[userRole] || demoUsers['ATTENDEE']
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login error' });
    }
});

// Register new user
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role = 'ATTENDEE', phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if email already exists
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Insert new user (password stored as-is for demo - use bcrypt in production!)
        const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `, [name, email, password, role, phone]);

        res.status(201).json({
            success: true,
            user: {
                id: result.insertId,
                name,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration error' });
    }
});

// GET all users (admin only)
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, email, role, phone, is_active, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// GET user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, email, role, phone, profile_image_url, is_active, created_at
      FROM users WHERE id = ?
    `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// GET organizers for dropdown
router.get('/role/organizers', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT id, name, email FROM users WHERE role = 'ORGANIZER' AND is_active = TRUE
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching organizers:', error);
        res.status(500).json({ message: 'Error fetching organizers' });
    }
});

export default router;
