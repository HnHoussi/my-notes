# Work in group

This guide explains what to do every day: how to work on your **feature branch** and how to merge your feature into `develop`.

---

## Branches
- `main` → stable, production-ready code
- `develop` → integration branch where everyone merges completed features
- Feature branch → e.g. `feature/login`, `feature/cart`, `feature/dashboard`

## In the morning (before starting work)

```bash
# Switch to your feature branch
git checkout feature/your-feature-name

# Update your local branch from the remote (in case you pushed yesterday)
git pull

# Get the latest changes from the team’s dev branch
git pull origin dev
```

## While you’re working
- Modify files and add new features.
- Save your work locally:

```bash
git add .
git commit -m "clear message describing what you did"
```

- Push your work so teammates can see it:

```bash
git push origin feature/your-feature-name
```

> 💡 Small, clear commits are better than one big commit.

## Update your branch with dev

When the team has merged new features into `dev`:

```bash
git checkout feature/your-feature-name
git pull origin dev
```

Resolve conflicts if needed.

## When your feature is ready

Merge your branch into `dev`:

```bash
# Switch to develop
git checkout dev

# Update develop from remote
git pull origin dev

# Merge your feature branch into develop
git merge feature/your-feature-name

# Push updated develop
git push origin dev
```

Or create a merge request / pull request from `feature/your-feature-name` → `dev`.

## Deleting a branch (cleanup)

Once your feature is merged into `dev` (and no longer needed), you can safely delete it.

### Delete locally
```bash
git branch -d feature/your-feature-name
```
> Use `-D` instead of `-d` if Git refuses because the branch isn’t fully merged.

### Delete on remote (GitHub)
```bash
git push origin --delete feature/your-feature-name
```

---

## Quick summary (copy/paste)

```bash
# Before starting
git checkout feature/your-feature-name
git pull
git pull origin dev

# After working
git add .
git commit -m "description"
git push origin feature/your-feature-name
```

```bash
# When the feature is ready
git checkout dev
git pull origin dev
git merge feature/your-feature-name
git push origin dev
```

---

## 📈 Visual diagram

```
main
  |
  o---------o---------o   ← stable production versions
            \
             dev
              o----o----o----o   ← feature integration
               \    \    \    \
                \    \    \    feature/login
                 \    \    o--o--o   ← feature branch
                  \    feature/cart
                   \    o--o--o
                    \
                     feature/dashboard
                      o--o--o
```

> Each feature has its own branch. When it’s ready, merge into `dev`.  
> When `dev` is stable, merge into `main`.
