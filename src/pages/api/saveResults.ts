import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {name, image_id, time} = req.body;
        console.log(name, image_id, time);
        if (!name || !image_id || time === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
        }
        const connection = await pool.getConnection();
        await connection.query(
        'INSERT INTO results (name, image_id, time) VALUES (?, ?, ?);',
        [name, image_id, time]
        );
        connection.release();

        return res.status(200).json({ message: 'Results saved successfully' });
    }
    catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}