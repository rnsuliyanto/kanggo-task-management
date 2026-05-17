const db = require('../db');

const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, search, page = 1, limit = 5 } = req.query;

        const offset = (Number(page) - 1) * Number(limit);

        let query = 'SELECT * FROM tasks WHERE user_id = ?';
        let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
        const queryParams = [userId];

        if (status) {
            query += ' AND status = ?';
            countQuery += ' AND status = ?';
            queryParams.push(status);
        }

        if (search) {
            query += ' AND title LIKE ?';
            countQuery += ' AND title LIKE ?';
            queryParams.push(`%${search}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        
        const [countResult] = await db.query(countQuery, queryParams);
        const total = countResult[0].total;

        const [tasks] = await db.query(query, [...queryParams, Number(limit), Number(offset)]);
        
        res.json({
            tasks,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const createTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, status, deadline } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Judul tugas wajib diisi' });
        }

        if (deadline) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(deadline)) {
                return res.status(400).json({ message: 'Format tanggal tidak valid' });
            }
        }

        const taskStatus = status || 'pending';

        const [result] = await db.query(
            'INSERT INTO tasks (title, description, status, deadline, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, description || null, taskStatus, deadline || null, userId]
        );

        res.status(201).json({ message: 'Tugas berhasil dibuat', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const { title, description, status, deadline } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Judul tugas wajib diisi' });
        }

        if (deadline) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(deadline)) {
                return res.status(400).json({ message: 'Format tanggal tidak valid' });
            }
        }

        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        }

        await db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ?, deadline = ? WHERE id = ? AND user_id = ?',
            [title, description || null, status || 'pending', deadline || null, taskId, userId]
        );

        res.json({ message: 'Tugas berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        }

        await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

        res.json({ message: 'Tugas berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };