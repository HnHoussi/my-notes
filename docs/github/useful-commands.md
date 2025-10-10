# Useful Commands

A quick reference of essential Git commands for common situations.

---

## Set Up Git (Configuration & Identity)

Before using Git on a new computer, it's good to configure your user info and preferences.

```bash
# Set your name and email (used for commits)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Check your current config
git config --list

# Set your default branch name (useful for new repos)
git config --global init.defaultBranch main
```

> 💡 Tip: Add this section for "first-time setup" — great for onboarding or fresh installs.

---

## SSH Setup for GitHub

To avoid typing passwords every time you push.

```bash
# Generate an SSH key
ssh-keygen -t ed25519 -C "you@example.com"

# Start the SSH agent
eval "$(ssh-agent -s)"

# Add your new key
ssh-add ~/.ssh/id_ed25519

# Copy your public key to your clipboard
cat ~/.ssh/id_ed25519.pub
```

Then go to **GitHub → Settings → SSH and GPG keys → New SSH key**, and paste it.

---

## Clone a Project (from GitHub)

When you want to start working on an existing repository.

```bash
# Clone a repository
git clone https://github.com/username/repository-name.git

# Enter the project folder
cd repository-name

# See the available branches
git branch -a

# Switch to the main or develop branch
git checkout dev
```

> 💡 Tip: You can use SSH instead of HTTPS if your SSH key is set up.

---

## Create a New Project Locally and Push to GitHub

When you start from scratch and want to publish your code online.

```bash
# Initialize a new git repository
git init

# Add all your files
git add .

# Create your first commit
git commit -m "Initial commit"

# Link your local repo to a new GitHub repo
git remote add origin https://github.com/username/repository-name.git

# Push it to the main branch
git branch -M main
git push -u origin main
```

> 💡 Tip: Always create a `.gitignore` file before your first commit (for Node, Python, etc.).

---

## Rename a branch

```bash
# Rename the current branch
git branch -m new-branch-name

# OR rename a specific branch
git branch -m old-branch-name new-branch-name

# Push the new branch name to remote
git push origin -u new-branch-name

# Delete the old branch from the remote
git push origin --delete old-branch-name

# Update your local HEAD to track the new remote branch (optional)
git branch --set-upstream-to=origin/new-branch-name
```

---

## Creating and Switching Branches

Useful when starting new features or bug fixes.

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Switch between branches
git checkout dev
```

---

## Check Status and History

Inspect your current state and previous commits.

```bash
# See what's changed
git status

# See your commit history in a compact view
git log --oneline --graph --decorate --all
```

---

## Stashing (Pause Work Without Committing)

Super handy when you need to switch branches but don't want to commit yet.

```bash
# Save your uncommitted changes
git stash

# Show stashed changes
git stash list

# Reapply your latest stash
git stash apply

# Delete your latest stash
git stash drop
```

> 💡 Tip: Great for "quick context switching" during reviews or urgent bug fixes.

---

## Inspect Differences

Compare changes between commits or branches.

```bash
# Compare unstaged changes
git diff

# Compare staged changes
git diff --cached

# Compare two branches
git diff main..dev
```

---

## Tags and Releases

When you want to mark specific versions (e.g., `v1.0.0`).

```bash
# Create a tag
git tag v1.0.0

# Create a tag with a message
git tag -a v1.0.0 -m "First stable release"

# Push tags to remote
git push origin --tags

# List all tags
git tag
```

---

## Rebasing and Squashing Commits

Useful for keeping a clean history (especially before merging).

```bash
# Rebase your branch on top of dev
git checkout feature/your-feature-name
git rebase dev

# Interactive rebase (squash multiple commits into one)
git rebase -i HEAD~3
```

> ⚠️ Warning: Only rebase *your own* local branches — never on shared branches like `dev` or `main`.

---

## Undo Mistakes (Safely)

Recover from common Git errors.

```bash
# Unstage a file (remove from 'git add')
git reset HEAD file.txt

# Undo the last commit but keep your changes
git reset --soft HEAD~1

# Discard all local changes (⚠️ irreversible)
git checkout -- file.txt
```

---

## Clean Up Old Branches

Keep your repository organized by deleting merged branches.

```bash
# Delete a local branch
git branch -d feature/your-feature-name

# Delete a remote branch
git push origin --delete feature/your-feature-name
```
