const express = require('express');
const githubService = require('../services/githubService');
const analyticsService = require('../services/analyticsService');
const router = express.Router();

router.post('/install', async (req, res) => {
  const { repoUrl } = req.body;
  if (!await githubService.validateRepoUrl(repoUrl)) {
    return res.status(400).json({ error: 'Invalid GitHub repository URL' });
  }

  try {
    const result = await githubService.installExtension(repoUrl, req.user.id);
    await analyticsService.trackInstall(req.user.id, repoUrl, result.success ? 'Success' : 'Failed');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Installation failed' });
  }
});

router.get('/history', async (req, res) => {
  const analytics = await analyticsService.getUserAnalytics(req.user.id);
  res.json(analytics.history);
});

router.get('/stats', async (req, res) => {
  const analytics = await analyticsService.getUserAnalytics(req.user.id);
  res.json(analytics.stats);
});

module.exports = router;
