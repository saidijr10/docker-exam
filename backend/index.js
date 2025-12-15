const express = require("express");
const { Client } = require("pg");

const app = express();
app.use(express.urlencoded({ extended: true }));

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const connectWithRetry = () => {
    client.connect()
        .then(() => {
            console.log("Connected to PostgreSQL");
            return client.query(`
        CREATE TABLE IF NOT EXISTS counter (
          id SERIAL PRIMARY KEY,
          value INT
        );
      `);
        })
        .then(() => {
            return client.query(`
        INSERT INTO counter (value)
        SELECT 0 WHERE NOT EXISTS (SELECT * FROM counter);
      `);
        })
        .catch(err => {
            console.log("DB not ready, retrying in 3 seconds...");
            setTimeout(connectWithRetry, 3000);
        });
};

connectWithRetry();

app.get("/", async (req, res) => {
    const result = await client.query("SELECT value FROM counter LIMIT 1");
    const value = result.rows[0].value;

    res.send(`
    <html>
    <head>
      <title>Counter App</title>
      <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            margin-bottom: 20px;
        }
        .counter {
            font-size: 3rem;
            margin: 20px 0;
            color: #333;
        }
        .buttons button {
            padding: 10px 20px;
            margin: 5px;
            font-size: 1rem;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            transition: background 0.3s;
        }
        #increment {
            background: #4caf50;
            color: white;
        }
        #decrement {
            background: #f44336;
            color: white;
        }
        .buttons button:hover {
            opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Counter App</h1>
        <div class="counter">${value}</div>
        <div class="buttons">
          <form method="POST" action="/inc" style="display:inline;">
            <button id="increment">+</button>
          </form>
          <form method="POST" action="/dec" style="display:inline;">
            <button id="decrement">-</button>
          </form>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.post("/inc", async (req, res) => {
    await client.query("UPDATE counter SET value = value + 1");
    res.redirect("/");
});

app.post("/dec", async (req, res) => {
    await client.query("UPDATE counter SET value = value - 1");
    res.redirect("/");
});

app.listen(3000, () => console.log("App running on port 3000"));
