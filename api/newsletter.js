import fs from 'fs';
import path from 'path';

const NEWSLETTER_DIR = path.join(process.cwd(), '..', 'newsletter', 'issues');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { articleId } = req.query;

    if (articleId) {
      // Fetch specific article
      const articlePath = path.join(NEWSLETTER_DIR, `${articleId}.md`);
      
      if (!fs.existsSync(articlePath)) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const content = fs.readFileSync(articlePath, 'utf-8');
      return res.status(200).json({ content });
    } else {
      // List all articles
      const files = fs.readdirSync(NEWSLETTER_DIR)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse();

      const articles = files.map(file => {
        const filePath = path.join(NEWSLETTER_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        const title = lines[0]?.replace(/^#\s+/, '') || file;
        const match = file.match(/issue-(\d+)/);
        const issueNum = match ? parseInt(match[1]) : 0;

        return {
          id: file.replace('.md', ''),
          title,
          issueNum,
          date: new Date(fs.statSync(filePath).mtime),
          wordCount: content.split(' ').length
        };
      });

      return res.status(200).json({ articles });
    }
  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
