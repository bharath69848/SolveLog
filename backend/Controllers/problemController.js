import pool from '../config/db.js'

export const createProblemSession = async (req, res) => {
  try {
    const { problem_name, difficulty, tags, platfrom, status } = req.body;
    const user_id = req.user.userId;

    if (!problem_name || !difficulty) {
      return res.status(400).json({ message: "problem_name and difficulty are required" });
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "difficulty must be easy, medium, or hard" });
    }

    const query = `
      INSERT INTO problem_sessions (user_id, problem_name, difficulty, tags, platfrom, start_time, status)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING *;
    `;

    const values = [user_id, problem_name, difficulty, tags || [], platfrom || null, status || null];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Problem session created successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating problem session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const endProblemSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { status } = req.body;
    const user_id = req.user.userId;

    const sessionQuery = `
      SELECT * FROM problem_sessions
      WHERE id = $1 AND user_id = $2;
    `;

    const sessionResult = await pool.query(sessionQuery, [session_id, user_id]);

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: "Problem session not found" });
    }

    const session = sessionResult.rows[0];

    const startTime = new Date(session.start_time);
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);

    const updateQuery = `
      UPDATE problem_sessions
      SET end_time = NOW(), duration = $1, status = $2
      WHERE id = $3
      RETURNING *;
    `;

    const updateResult = await pool.query(updateQuery, [duration, status || session.status, session_id]);

    res.status(200).json({
      message: "Problem session ended successfully",
      data: updateResult.rows[0]
    });

  } catch (error) {
    console.error("Error ending problem session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getUserProblemSessions = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const query = `
      SELECT * FROM problem_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [user_id]);

    res.status(200).json({
      message: "Problem sessions retrieved successfully",
      data: result.rows
    });

  } catch (error) {
    console.error("Error fetching problem sessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getProblemSessionById = async (req, res) => {
  try {
    const { session_id } = req.params;
    const user_id = req.user.userId;

    const query = `
      SELECT * FROM problem_sessions
      WHERE id = $1 AND user_id = $2;
    `;

    const result = await pool.query(query, [session_id, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Problem session not found" });
    }

    res.status(200).json({
      message: "Problem session retrieved successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error fetching problem session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
