function detectBrowser(ua) {
  ua = ua.toLowerCase();
  if (/chrome/.test(ua) && !/edge|opr/.test(ua)) return 'Chrome';
  if (/firefox/.test(ua)) return 'Firefox';
  if (/safari/.test(ua) && !/chrome/.test(ua)) return 'Safari';
  if (/opr/.test(ua)) return 'Opera';
  if (/edge/.test(ua)) return 'Edge';
  return 'Unknown';
}

module.exports = { detectBrowser };
