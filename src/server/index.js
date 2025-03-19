require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { securityHeaders, authenticate, restrictBrowser } = require('./middleware/security');
const { rateLimit } = require('./middleware/rateLimiter');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(securityHeaders);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));
app.use(rateLimit);
app.use('/api', authenticate, apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
