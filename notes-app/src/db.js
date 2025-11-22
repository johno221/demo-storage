// src/db.js
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("Warning: DATABASE_URL is not set. DB will not work.");
}

const pool = new Pool({
  connectionString,
});

async function init() {
  // jednoduchá tabuľka na poznámky
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

async function getNotes() {
  const result = await pool.query(
    "SELECT id, text, created_at FROM notes ORDER BY id DESC"
  );
  return result.rows;
}

async function createNote(text) {
  const result = await pool.query(
    "INSERT INTO notes (text) VALUES ($1) RETURNING id, text, created_at",
    [text]
  );
  return result.rows[0];
}

module.exports = {
  init,
  getNotes,
  createNote,
};
