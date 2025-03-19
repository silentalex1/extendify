const jwt = require('jsonwebtoken');
const { detectBrowser } = require('../../utils/browserDetect');

function securityHeaders(req, res, next) {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com");
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

function restrictBrowser(req, res, next) {
  const browser = detectBrowser(req.headers['user-agent']);
  if (browser !== 'Chrome') {
    return res.status(403).json({ error: 'Only Chrome is supported' });
  }
  req.browser = browser;
  next();
}

module.exports = { securityHeaders, authenticate, restrictBrowser };
