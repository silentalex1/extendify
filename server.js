const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DB_PATH = './data.json';


if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));


app.get('/get-extensions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(data);
});


app.post('/post-extension', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).send('Invalid data');
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    data.push({ name, description });
    fs.writeFileSync(DB_PATH, JSON.stringify(data));
    res.status(201).send('Extension posted!');
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
