# GitHub Setup & Upload Instructions

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** (top right) → **"New repository"**
3. Fill in details:
   - **Repository name:** `music-app` (or your preferred name)
   - **Description:** "A Node.js music player with MongoDB Atlas"
   - **Visibility:** Public (or Private)
   - **Initialize with:** Leave unchecked (you already have files)
4. Click **"Create repository"**
5. Copy the repository URL (e.g., `https://github.com/yourusername/music-app.git`)

## Step 2: Initialize Git in Your Project

Open PowerShell and navigate to your project:

```powershell
cd "d:\Programs\FSD\Music _app"
```

## Step 3: Configure Git (First time only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Initialize Git Repository

```powershell
git init
```

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` and `REPO_NAME`:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/dharshini/music-app.git
```

## Step 6: Create .env File (Do NOT commit)

Make sure you have `.env` file locally with your actual credentials:

```
MONGO_URL=mongodb+srv://youruser:yourpassword@cluster0.nscyi.mongodb.net/musicDB?retryWrites=true&w=majority
DB_NAME=musicDB
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

## Step 7: Stage All Files

```powershell
git add .
```

## Step 8: Check What Will Be Committed

```powershell
git status
```

**Expected output:**
```
On branch master
Changes to be committed:
  new file:   .env.example
  new file:   .gitignore
  new file:   README.md
  new file:   package.json
  new file:   addSongs.js
  ...
```

⚠️ **Important:** `.env` should NOT appear in the list (it's in .gitignore)

## Step 9: Create First Commit

```powershell
git commit -m "Initial commit: Music app with MongoDB integration"
```

## Step 10: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**First time push:** You may need to authenticate
- **HTTPS:** Enter your GitHub username and Personal Access Token (PAT)
- **SSH:** Set up SSH key (optional, more secure)

### Get GitHub Personal Access Token (if needed):

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Click **"Generate new token"**
3. Give it a name: `git-access`
4. Select scopes: `repo` (full control of private repositories)
5. Click **"Generate token"**
6. Copy and save the token (you'll use it as password for HTTPS authentication)

## Step 11: Verify on GitHub

1. Go to your GitHub repository URL
2. You should see all your files listed
3. `.env` should NOT be there (only `.env.example`)
4. You should see a green checkmark next to the commit

## Future Updates

After making changes to your code:

```powershell
cd "d:\Programs\FSD\Music _app"
git add .
git commit -m "Describe your changes here"
git push origin main
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `git status` | See current changes |
| `git log` | View commit history |
| `git diff` | See what changed in files |
| `git clone <url>` | Download repo locally |
| `git pull origin main` | Get latest changes from GitHub |
| `git branch` | List branches |
| `git checkout -b <branch>` | Create new branch |

## Troubleshooting

### "fatal: not a git repository"
```powershell
git init
```

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/music-app.git
```

### "Permission denied"
- Make sure you're using correct GitHub credentials
- Check if SSH key is set up properly
- Use HTTPS with Personal Access Token if SSH fails

### ".env file still appears in commits"
```powershell
git rm --cached .env
git commit -m "Remove .env from tracking"
```

## Best Practices

✅ Always push changes before sharing code  
✅ Write meaningful commit messages  
✅ Never commit `.env` or sensitive files  
✅ Use `.gitignore` for secrets and node_modules  
✅ Keep README updated with setup instructions  
✅ Create branches for new features (`feature/feature-name`)  
✅ Review changes before committing (`git diff`)  

## Need SSH Setup? (Optional, More Secure)

```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub Settings → SSH and GPG keys → New SSH key
```

---

**Your project is now ready to share on GitHub! 🚀**
