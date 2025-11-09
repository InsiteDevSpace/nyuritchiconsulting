# Deployment Workflow Explanation

This document explains each line of the GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

## Workflow File Breakdown

### Workflow Name and Triggers

```yaml
name: Deploy to Hostinger
```
**What it does:** Sets the name of the workflow that appears in GitHub Actions.

```yaml
on:
  push:
    branches:
      - main
```
**What it does:** Triggers the workflow automatically when code is pushed to the `main` branch.

```yaml
  workflow_dispatch:
```
**What it does:** Allows manual triggering of the workflow from the GitHub Actions tab.

### Job Configuration

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
```
**What it does:** Creates a job named "deploy" that runs on the latest Ubuntu virtual machine.

### Step 1: Checkout Code

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```
**What it does:** Downloads your repository code to the GitHub Actions runner so it can build your app.

### Step 2: Setup Node.js

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "18"
    cache: "npm"
```
**What it does:** 
- Installs Node.js version 18 on the runner
- Caches npm packages to speed up future runs

### Step 3: Install Dependencies

```yaml
- name: Install dependencies
  run: npm ci
```
**What it does:** Installs all project dependencies from `package-lock.json` (clean install, faster and more reliable than `npm install`).

### Step 4: Build React App

```yaml
- name: Build React app
  run: npm run build
```
**What it does:** Builds your React app for production, creating optimized files in the `dist/` folder.

### Step 5: Install sshpass

```yaml
- name: Install sshpass
  run: |
    sudo apt-get update
    sudo apt-get install -y sshpass
```
**What it does:** 
- Updates package list
- Installs `sshpass` tool which allows SSH password authentication (needed because we use password instead of SSH keys)

### Step 6: Setup SSH

```yaml
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    ssh-keyscan -p ${{ secrets.HOSTINGER_SSH_PORT }} -H ${{ secrets.HOSTINGER_SSH_HOST }} >> ~/.ssh/known_hosts
```
**What it does:** 
- Creates the `.ssh` directory if it doesn't exist
- Adds the server's SSH fingerprint to `known_hosts` to avoid connection prompts

### Step 7: Deploy to Hostinger

```yaml
- name: Deploy to Hostinger
  env:
    SSH_USER: ${{ secrets.HOSTINGER_SSH_USER }}
    SSH_HOST: ${{ secrets.HOSTINGER_SSH_HOST }}
    SSH_PORT: ${{ secrets.HOSTINGER_SSH_PORT }}
    SSH_PASSWORD: ${{ secrets.HOSTINGER_SSH_PASSWORD }}
    DEPLOY_PATH: ${{ secrets.HOSTINGER_DEPLOY_PATH }}
```
**What it does:** Sets environment variables from GitHub Secrets (SSH credentials and deployment path).

```yaml
  run: |
    # Create temporary directory for upload
    sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "mkdir -p ~/deploy-temp"
```
**What it does:** 
- Connects to your server via SSH using password authentication
- Creates a temporary directory `~/deploy-temp` on the server to store files before deployment

```yaml
    # Upload build files
    sshpass -p "$SSH_PASSWORD" scp -P $SSH_PORT -o StrictHostKeyChecking=no -r dist/* $SSH_USER@$SSH_HOST:~/deploy-temp/
```
**What it does:** 
- Uses `scp` (secure copy) to upload all files from the local `dist/` folder to the server's `~/deploy-temp/` directory
- `-r` flag copies recursively (includes subdirectories like `assets/`)

```yaml
    # Deploy to production
    sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST bash << EOF
      set -e
```
**What it does:** 
- Connects to server and runs a bash script
- `set -e` stops execution if any command fails (error handling)

```yaml
      # Use domain-specific path if available, otherwise fallback to provided path
      if [ -d ~/domains/nyuritchiconsulting.com/public_html/test ]; then
        DEPLOY_PATH="~/domains/nyuritchiconsulting.com/public_html/test"
      elif [ -d ~/domains/nyuritchiconsulting.com/public_html ]; then
        DEPLOY_PATH="~/domains/nyuritchiconsulting.com/public_html/test"
      else
        DEPLOY_PATH="$DEPLOY_PATH"
      fi
```
**What it does:** 
- Checks if domain-specific directory exists (Hostinger uses this structure)
- If found, uses that path; otherwise uses the path from GitHub Secrets
- This ensures files go to the correct location that the web server can access

```yaml
      # Expand ~ to full path
      DEPLOY_PATH=\$(eval echo \$DEPLOY_PATH)
```
**What it does:** Converts `~/domains/...` to full path like `/home/u123456789/domains/...`

```yaml
      # Backup existing files to backup folder inside test directory
      if [ -d "\$DEPLOY_PATH" ]; then
        # Check if there are files to backup (excluding backup folder)
        FILES_TO_BACKUP=\$(find "\$DEPLOY_PATH" -mindepth 1 -maxdepth 1 ! -name backup | wc -l)
        if [ "\$FILES_TO_BACKUP" -gt 0 ]; then
          BACKUP_DIR="\$DEPLOY_PATH/backup"
          mkdir -p "\$BACKUP_DIR"
          BACKUP_NAME="backup-\$(date +%Y%m%d-%H%M%S)"
          mkdir -p "\$BACKUP_DIR/\$BACKUP_NAME"
          # Copy all files and folders except the backup directory
          find "\$DEPLOY_PATH" -mindepth 1 -maxdepth 1 ! -name backup -exec cp -r {} "\$BACKUP_DIR/\$BACKUP_NAME/" \;
        fi
      fi
```
**What it does:** 
- Checks if deployment directory exists
- Counts files/folders to backup (excluding the backup folder itself)
- Creates a `backup` folder inside the test directory (e.g., `test/backup/`)
- Creates a timestamped backup folder (e.g., `backup-20251109-121500`) containing all old files
- Copies all files and folders from test directory to the backup, excluding the backup folder itself

```yaml
      # Create deployment directory and copy files
      mkdir -p "\$DEPLOY_PATH"
      cp -r ~/deploy-temp/* "\$DEPLOY_PATH"/
```
**What it does:** 
- Creates the deployment directory if it doesn't exist
- Copies all files from temporary directory to the final deployment location

```yaml
      # Set proper permissions
      find "\$DEPLOY_PATH" -type d -exec chmod 755 {} \;
      find "\$DEPLOY_PATH" -type f -exec chmod 644 {} \;
```
**What it does:** 
- Sets directory permissions to 755 (readable/executable by all, writable by owner)
- Sets file permissions to 644 (readable by all, writable by owner)
- This ensures the web server can read and serve your files

```yaml
      # Cleanup
      rm -rf ~/deploy-temp
```
**What it does:** Removes the temporary directory after deployment is complete.

```yaml
      echo "Deployment completed successfully to: \$DEPLOY_PATH"
    EOF
```
**What it does:** Prints success message with the deployment path, then ends the remote bash script.

## Required GitHub Secrets

Add these in: Repository → Settings → Secrets and variables → Actions

1. **HOSTINGER_SSH_USER** - Your SSH username
2. **HOSTINGER_SSH_PASSWORD** - Your SSH password
3. **HOSTINGER_SSH_HOST** - Server IP address
4. **HOSTINGER_SSH_PORT** - SSH port number
5. **HOSTINGER_DEPLOY_PATH** - Deployment path (fallback if domain path not found)

## Additional GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)
**What it does:**
- Runs on every pull request and push to main
- Verifies the React app builds successfully
- Checks that build output files exist
- Prevents broken code from being merged

### Security Scan (`.github/workflows/security.yml`)
**What it does:**
- Runs weekly (every Sunday) and on pull requests
- Scans npm dependencies for known vulnerabilities
- Reports security issues in the workflow logs
- Helps keep dependencies secure

### Preview Build (`.github/workflows/preview.yml`)
**What it does:**
- Runs on pull requests
- Builds the app and uploads artifacts
- Comments on PR with build information
- Allows downloading build files for testing

## Workflow Summary

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push to main / Manual | Deploys to production server |
| `ci.yml` | PR / Push to main | Verifies build works |
| `security.yml` | Weekly / PR | Scans for vulnerabilities |
| `preview.yml` | PR | Creates preview build |
