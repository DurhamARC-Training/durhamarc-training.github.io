const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const ORG = process.env.GITHUB_ORG || 'DurhamARC-Training';
const EXCLUDED_REPOS = ['durhamarc-training.github.io'];
const COURSE_INSTANCE_PATTERN = /^\d{4}-\d{2}-\d{2}-.+$/;

async function fetchAllRepos() {
  try {
    const repos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.repos.listForOrg({
        org: ORG,
        type: 'public',
        per_page: 100,
        page: page
      });

      repos.push(...response.data);
      hasMore = response.data.length === 100;
      page++;
    }

    return repos;
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    throw error;
  }
}

async function checkGitHubPages(owner, repo) {
  try {
    await octokit.repos.getPages({
      owner: owner,
      repo: repo
    });
    return `https://${owner.toLowerCase()}.github.io/${repo}/`;
  } catch (error) {
    return null;
  }
}

function parseDate(repoName) {
  const match = repoName.match(/^(\d{4})-(\d{2})-(\d{2})-DU$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
}

async function getCourseType(repo) {
  // Try to determine course type from repository topics, description, or name
  const topics = repo.topics || [];
  const description = (repo.description || '').toLowerCase();
  const name = repo.name.toLowerCase();

  // Common course type mappings
  if (topics.includes('git') || name.includes('git') || description.includes('git')) {
    return 'Version Control with Git';
  }
  if (topics.includes('python') || name.includes('python') || description.includes('python')) {
    return 'Python Programming';
  }
  if (topics.includes('r') || name.includes('r-') || description.includes(' r ')) {
    return 'R Programming';
  }
  if (topics.includes('shell') || name.includes('shell') || description.includes('shell')) {
    return 'Unix Shell';
  }
  if (topics.includes('carpentry') || description.includes('software carpentry')) {
    return 'Software Carpentry Workshop';
  }

  return 'Research Computing Course';
}

async function processRepositories(repos) {
  const materials = [];
  const instances = [];

  for (const repo of repos) {
    // Skip excluded repositories
    if (EXCLUDED_REPOS.includes(repo.name.toLowerCase())) {
      continue;
    }

    const pagesUrl = await checkGitHubPages(ORG, repo.name);

    // Check if it's a course instance
    if (COURSE_INSTANCE_PATTERN.test(repo.name)) {
      const date = parseDate(repo.name);
      const courseType = await getCourseType(repo);

      instances.push({
        date: date,
        course_type: courseType,
        description: repo.description || '',
        url: pagesUrl || repo.html_url,
        repo_url: repo.html_url,
        topics: repo.topics || []
      });
    } else {
      // It's training material
      materials.push({
        name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug: repo.name,
        description: repo.description || 'Training course materials',
        repo_url: repo.html_url,
        pages_url: pagesUrl,
        topics: repo.topics || [],
        updated: repo.updated_at,
        is_fork: repo.fork,
        stars: repo.stargazers_count
      });
    }
  }

  // Sort instances by date (most recent first)
  instances.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Sort materials by name
  materials.sort((a, b) => a.name.localeCompare(b.name));

  return { materials, instances };
}

async function main() {
  console.log(`Fetching repositories for ${ORG}...`);
  
  const repos = await fetchAllRepos();
  console.log(`Found ${repos.length} public repositories`);

  const { materials, instances } = await processRepositories(repos);
  console.log(`Processed ${materials.length} course materials and ${instances.length} course instances`);

  const data = {
    materials,
    instances,
    last_updated: new Date().toISOString()
  };

  // Ensure _data directory exists
  const dataDir = path.join(__dirname, '..', '_data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to _data/courses.json
  const outputPath = path.join(dataDir, 'courses.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Course data written to ${outputPath}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});