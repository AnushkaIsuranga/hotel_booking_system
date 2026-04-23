# Deployment API Notes

## Render Deployment Hook

The GitHub workflow `deploy-render.yml` triggers Render deployments using a deploy hook URL.

### Required GitHub Secret

- `RENDER_DEPLOY_HOOK_URL`: Render deploy hook endpoint for your web service.

### Workflow Behavior

- Runs automatically on pushes to `main`.
- Can also be run manually using `workflow_dispatch`.

## Container Runtime

The project deploys via Docker using:

- `Dockerfile`: multi-stage build for PHP + Node assets.
- `docker/start.sh`: startup script.
- `render.yaml`: Render service definition.

### Runtime Variables

Set these in Render environment variables:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=<your render url>`
- `APP_KEY=<generated app key>`
- `DB_CONNECTION=<sqlite|mysql|pgsql>`
- `DB_DATABASE=/var/data/database.sqlite` (when using sqlite on Render)
- `RUN_MIGRATIONS=true` (optional; runs migrations on boot)

### Render Persistent Disk (sqlite)

`render.yaml` defines a persistent disk mounted at `/var/data` so sqlite data survives container restarts.

## Default Admin Migration

A database migration now upserts a default admin user for development and demo environments.

- Email: `admin@123.com`
- Password: `Admin@123`

Migration file:

- `database/migrations/2026_04_23_120000_set_default_admin_credentials.php`
