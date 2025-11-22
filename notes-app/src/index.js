// src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Healthcheck
app.get("/health", async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      await db.init();
      res.status(200).json({ status: "ok", db: "ok" });
    } else {
      res.status(200).json({ status: "ok", db: "not_configured" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", db: "error" });
  }
});

// Zoznam poznámok
app.get("/notes", async (req, res) => {
  try {
    const notes = await db.getNotes();
    res.json(notes);
  } catch (err) {
    console.error("Error in GET /notes", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vytvorenie poznámky
app.post("/notes", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Field 'text' is required" });
    }

    const note = await db.createNote(text.trim());
    res.status(201).json(note);
  } catch (err) {
    console.error("Error in POST /notes", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, async () => {
  console.log(`Notes app listening on port ${port}`);
  if (process.env.DATABASE_URL) {
    try {
      await db.init();
      console.log("Database initialized");
    } catch (err) {
      console.error("Failed to init database", err);
    }
  } else {
    console.warn("DATABASE_URL not set, running without DB");
  }
});
