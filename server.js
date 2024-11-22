const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data.json');

if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/get-extensions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    res.json(data);
});

app.post('/post-extension', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    data.push({ name, description, id: Date.now() });
    fs.writeFileSync(DB_PATH, JSON.stringify(data));
    res.status(201).json({ message: 'Extension posted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
