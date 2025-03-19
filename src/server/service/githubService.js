const { Octokit } = require('octokit');
const axios = require('axios');

class GithubService {
  constructor() {
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async installExtension(repoUrl, userId) {
    const [owner, repo] = this.parseRepoUrl(repoUrl);
    const crxFile = await this.getCrxFile(owner, repo);
    
    return {
      success: !!crxFile,
      downloadUrl: crxFile?.download_url,
      message: crxFile ? 'Extension ready for download' : 'No valid .crx file found'
    };
  }

  async validateRepoUrl(url) {
    const regex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/;
    return regex.test(url) && await this.checkRepoExists(url);
  }

  async checkRepoExists(url) {
    const [owner, repo] = this.parseRepoUrl(url);
    try {
      await this.octokit.rest.repos.get({ owner, repo });
      return true;
    } catch {
      return false;
    }
  }

  async getCrxFile(owner, repo) {
    const { data: contents } = await this.octokit.rest.repos.getContent({ owner, repo, path: '' });
    return contents.find(file => file.name.endsWith('.crx'));
  }

  parseRepoUrl(url) {
    const parts = url.replace('https://github.com/', '').split('/');
    return [parts[0], parts[1]];
  }
}

module.exports = new GithubService();
