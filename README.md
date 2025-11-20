# Durham ARC Training Site

This repository contains the source code for the Durham Advanced Research Computing training course index at [https://durhamarc-training.github.io/](https://durhamarc-training.github.io/).

## About

This site provides a dynamic, automatically-updated index of all training courses and materials offered by Durham ARC. The site automatically discovers and categorizes repositories from the [DurhamARC-Training](https://github.com/DurhamARC-Training) organization.

## Features

- **Automatic Updates**: A GitHub Action runs daily to fetch the latest course information
- **Smart Categorization**: Automatically distinguishes between:
  - Training materials (ongoing course content)
  - Course instances (specific dated workshops)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Durham Brand Compliant**: Follows Durham University's visual identity guidelines
- **Jekyll-Powered**: Static site generation for fast, reliable hosting via GitHub Pages

## How It Works

### Course Discovery

The site automatically discovers courses from the organization's public repositories:

1. **Training Materials**: Repositories like `Intermediate-Python`, `git-novice`, `BasicParallelProgramming`
   - Listed under "Available Courses"
   - Include links to course materials and GitHub repositories
   - Tagged with relevant topics

2. **Course Instances**: Repositories matching the pattern `YYYY-MM-DD-*` (e.g., `2025-07-03-DISKAH`, `2024-10-14-DU`)
   - Automatically sorted by date
   - Separated into "Upcoming" and "Past" courses
   - Include course type detection based on repository metadata

### Automatic Updates

A scheduled GitHub Action workflow runs daily at 6am UTC to:
1. Query the GitHub API for all public repositories in the organization
2. Categorize and process repository data
3. Generate an updated `_data/courses.json` file
4. Commit changes if new courses are detected
5. Trigger Jekyll to rebuild the site

## Technology Stack

- **[Jekyll](https://jekyllrb.com/)**: Static site generator (built into GitHub Pages)
- **[Liquid](https://shopify.github.io/liquid/)**: Templating language for dynamic content
- **[GitHub Actions](https://github.com/features/actions)**: Automated workflow execution
- **[Octokit](https://github.com/octokit/rest.js)**: GitHub API client for Node.js
- **GitHub Pages**: Free hosting and automatic deployment

## Repository Structure

```
durhamarc-training.github.io/
├── _config.yml              # Jekyll site configuration
├── _layouts/
│   └── default.html         # HTML layout template
├── _data/
│   └── courses.json         # Auto-generated course data
├── index.md                 # Main page (Liquid template)
├── assets/
│   └── css/
│       └── style.css        # Durham-branded styling
├── .github/
│   └── workflows/
│       └── update-courses.yml  # Daily update automation
├── scripts/
│   ├── package.json         # Node.js dependencies
│   └── fetch-courses.js     # Course discovery script
└── README.md                # This file
```

## Adding New Courses

### Adding Training Materials

Simply create a new public repository in the [DurhamARC-Training](https://github.com/DurhamARC-Training) organization:

1. Give it a descriptive name (e.g., `Advanced-R-Programming`)
2. Add a clear description
3. Add relevant GitHub topics/tags (e.g., `r`, `programming`, `statistics`)
4. Enable GitHub Pages if you want to publish course materials

The course will automatically appear on the site within 24 hours (or immediately if you trigger the workflow manually).

### Adding Course Instances

Create a repository with the naming pattern: `YYYY-MM-DD-SUFFIX`

- `YYYY`: Four-digit year
- `MM`: Two-digit month
- `DD`: Two-digit day
- `SUFFIX`: Any identifier (e.g., `DU`, `ABCDEF`, `ONLINE`)

**Examples:**
- `2025-07-03-DISKAH` - July 3, 2025 course for the [DISKAH Network](https://culturedigitalskills.org/)
- `2024-10-14-DU` - October 14, 2024 course at Durham University
- `2026-01-15-ONLINE` - January 15, 2026 online course

The course will automatically:
- Be sorted by date
- Appear in "Upcoming" or "Past" sections
- Have its course type detected from repository metadata
- Link to the course page if GitHub Pages is enabled

## Manual Workflow Trigger

To update the site immediately without waiting for the scheduled run:

1. Go to the [Actions](../../actions) tab
2. Select "Update Course Data" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 2-3 minutes for completion

## Development

### Local Testing

To test the site locally:

```bash
# Install Jekyll and dependencies
gem install bundler jekyll

# Clone the repository
git clone https://github.com/DurhamARC-Training/durhamarc-training.github.io.git
cd durhamarc-training.github.io

# Serve locally
jekyll serve

# Visit http://localhost:4000
```

### Testing the Course Discovery Script

```bash
cd scripts
npm install
GITHUB_TOKEN=your_token_here GITHUB_ORG=DurhamARC-Training node fetch-courses.js
```

This will generate `_data/courses.json` based on current repositories.

## Customization

### Styling

Edit `assets/css/style.css` to modify the site appearance. The current design follows [Durham University's brand guidelines](https://www.dur.ac.uk/brand/).

### Course Type Detection

The script attempts to detect course types based on:
- Repository topics/tags
- Repository names
- Repository descriptions

To improve detection, edit the `getCourseType()` function in `scripts/fetch-courses.js`.

### Update Schedule

To change the update frequency, edit the cron schedule in `.github/workflows/update-courses.yml`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6am UTC
```

## Excluded Repositories

The following repositories are automatically excluded from the course listing:
- `durhamarc-training.github.io` (this site's repository)
- Any private repositories

To exclude additional repositories, edit the `EXCLUDED_REPOS` array in `scripts/fetch-courses.js`.

## Contributing

Contributions are welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Test locally with Jekyll
5. Submit a pull request

For major changes, please open an issue first to discuss the proposed changes.

## Support

For questions or issues:

- **Technical issues with the site**: [Open an issue](../../issues)
- **Course content questions**: Contact the course instructors
- **General ARC training inquiries**: Visit [Durham ARC Training](https://dur.ac.uk/research/institutes-and-centres/advanced-research-computing/training-)

## License

This site infrastructure is available under the MIT License. Individual course materials may have their own licenses - please check each course repository for details.

## Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/)
- Design follows [Durham University Brand Guidelines](https://www.dur.ac.uk/brand/)
- Inspired by [Software Carpentry](https://software-carpentry.org/) workshop organization