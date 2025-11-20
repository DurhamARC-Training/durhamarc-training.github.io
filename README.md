# Durham ARC Training Site

Dynamic training course index for DurhamARC-Training organization.

## Setup Instructions

### 1. Create Repository Structure

Create the following directory structure in your repository:

```
durhamarc-training.github.io/
├── _config.yml
├── _layouts/
│   └── default.html
├── _data/
│   └── courses.json (will be auto-generated)
├── index.md
├── assets/
│   └── css/
│       └── style.css
├── .github/
│   └── workflows/
│       └── update-courses.yml
├── scripts/
│   ├── package.json
│   └── fetch-courses.js
└── README.md
```

### 2. Add Required Files

Copy all the artifact files I've created into their respective locations:

- `_config.yml` → root directory
- `_layouts/default.html` → create `_layouts` folder
- `index.md` → root directory
- `assets/css/style.css` → create `assets/css` folders
- `.github/workflows/update-courses.yml` → create `.github/workflows` folders
- `scripts/package.json` → create `scripts` folder
- `scripts/fetch-courses.js` → `scripts` folder

### 3. Create Initial Data File

Create an empty `_data` directory and add a placeholder `courses.json`:

```json
{
  "materials": [],
  "instances": [],
  "last_updated": "2024-01-01T00:00:00Z"
}
```

### 4. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Under "Source", select `main` branch and `/ (root)` folder
3. Click Save
4. GitHub will automatically use Jekyll to build your site

### 5. Initial Run

The GitHub Action will run automatically when you push these files. You can also:

1. Go to the "Actions" tab in your repository
2. Select "Update Course Data" workflow
3. Click "Run workflow" → "Run workflow"

This will fetch all repository data and populate `_data/courses.json`.

### 6. Verify

After the action completes (2-3 minutes):

1. Check that `_data/courses.json` has been created and committed
2. Visit https://durhamarc-training.github.io/
3. You should see your courses listed dynamically

## How It Works

1. **GitHub Action** runs daily at 6am UTC (or manually via workflow_dispatch)
2. **fetch-courses.js** script:
   - Fetches all public repositories from DurhamARC-Training
   - Categorizes them as:
     - **Course instances**: Repos matching `YYYY-MM-DD-DU` pattern
     - **Training materials**: All other public repos
   - Checks for GitHub Pages availability
   - Generates `_data/courses.json`
3. **Jekyll** uses Liquid templating in `index.md` to:
   - Display all training materials as course cards
   - List upcoming course instances
   - Show past courses in a collapsible section
4. **GitHub Pages** automatically rebuilds the site when data changes

## Customization

### Update Course Type Detection

Edit `scripts/fetch-courses.js`, function `getCourseType()` to improve course type detection based on repository topics, names, or descriptions.

### Modify Styling

Edit `assets/css/style.css` to change colors, layouts, or add animations.

### Change Schedule

Edit `.github/workflows/update-courses.yml` cron schedule:
```yaml
- cron: '0 6 * * *'  # Daily at 6am UTC
```

### Add New Sections

Edit `index.md` and add new Liquid template sections. Available data:
- `site.data.courses.materials` - array of course materials
- `site.data.courses.instances` - array of course instances
- `site.data.courses.last_updated` - timestamp

## Maintenance

- **Add new courses**: Just create a new repository in the organization - it will appear automatically
- **Course instances**: Name repositories `YYYY-MM-DD-DU` to be recognized as instances
- **Topics/tags**: Add GitHub topics to repositories for better categorization
- **Descriptions**: Repository descriptions appear on course cards

## Troubleshooting

**Action fails**: Check the Actions tab for error logs. Common issues:
- Missing Node.js dependencies (fixed by workflow automatically)
- GitHub API rate limits (shouldn't happen with authenticated requests)

**Site not updating**: 
- Check that the action completed successfully
- Verify `_data/courses.json` was committed
- GitHub Pages can take 1-2 minutes to rebuild after commits

**Missing courses**:
- Ensure repositories are public (private repos are excluded)
- Check repository name isn't in EXCLUDED_REPOS list

## License

This site infrastructure is MIT licensed. Course materials may have their own licenses.
