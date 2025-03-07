import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const PORT = 8080;

// Open the SQLite database
const db = new Database('./database/antigone.db');

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Example endpoint to query the database
app.get('/read/:linNum', async (req, res) => {
  try {
    const linNum = decodeURIComponent(req.params.linNum)

    // Query data from the database
    const result = await db.all('SELECT line_text, speaker FROM full_text');
    
    // Return data from the query
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on port ${PORT}`);
});
