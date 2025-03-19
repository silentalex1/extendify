const db = require('../config/database');

class AnalyticsService {
  async trackInstall(userId, repoUrl, status) {
    await db.saveInstall({
      repoUrl,
      browser: 'Chrome',
      status,
      userId
    });
  }

  async getUserAnalytics(userId) {
    const [history, stats] = await Promise.all([
      db.getHistory(userId),
      db.getStats(userId)
    ]);
    return { history, stats };
  }
}

module.exports = new AnalyticsService();
