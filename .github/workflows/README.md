# GitHub Actions Deployment

This workflow automatically deploys the application to Hostinger when code is pushed to the `main` branch.

## Setup Instructions

### 1. Generate SSH Key Pair

If you don't have an SSH key pair, generate one:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@etudesservices.com" -f ~/.ssh/hostinger_deploy
```

This creates:

- `~/.ssh/hostinger_deploy` (private key)
- `~/.ssh/hostinger_deploy.pub` (public key)

### 2. Add Public Key to Hostinger

1. Log in to your Hostinger account
2. Go to **hPanel** → **Advanced** → **SSH Access**
3. Add the public key (`hostinger_deploy.pub` content) to authorized keys

Or via SSH:

```bash
cat ~/.ssh/hostinger_deploy.pub | ssh your-username@your-hostinger-server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name                 | Description                     | Example                                                   |
| --------------------------- | ------------------------------- | --------------------------------------------------------- |
| `HOSTINGER_SSH_HOST`        | Hostinger server hostname or IP | `ssh.hostinger.com` or `123.45.67.89`                     |
| `HOSTINGER_SSH_USER`        | SSH username                    | `u123456789`                                              |
| `HOSTINGER_SSH_PRIVATE_KEY` | Private SSH key content         | Content of `~/.ssh/hostinger_deploy`                      |
| `HOSTINGER_DEPLOY_PATH`     | Path to deploy on server        | `/home/u123456789/domains/etudesservices.com/public_html` |

### 4. Get Your Private Key Content

```bash
cat ~/.ssh/hostinger_deploy
```

Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) and paste it into the `HOSTINGER_SSH_PRIVATE_KEY` secret.

### 5. Find Your Deploy Path

Common Hostinger paths:

- **Shared Hosting**: `/home/u[user-id]/domains/[domain]/public_html`
- **VPS**: `/var/www/html` or custom path

You can find it by SSHing into your server and running:

```bash
pwd
# or
echo $HOME
```

## How It Works

1. **Trigger**: Automatically runs on every push to `main` branch
2. **Build**: Installs dependencies and builds the React app
3. **Deploy**:
   - Uploads frontend build (`dist/*`) to root directory
   - Sets proper file permissions
4. **Cleanup**: Removes temporary files and SSH keys

## Manual Deployment

If you need to deploy manually:

```bash
# Build frontend
npm install
npm run build

# Deploy via SSH
scp -r dist/* user@hostinger-server:/path/to/public_html/
```

## Troubleshooting

### SSH Connection Issues

- Verify SSH credentials in GitHub secrets
- Test SSH connection manually: `ssh user@host`
- Check Hostinger SSH access is enabled

### Permission Errors

- Ensure deploy path is writable
- Check file permissions on server
- Verify `cms-content.json` has write permissions (666)

### Build Failures

- Check Node.js version compatibility
- Verify all dependencies are in `package-lock.json`
- Review build logs in GitHub Actions
