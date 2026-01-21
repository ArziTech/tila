# Docker Setup for TILA

This guide covers Docker-based development and production deployment for the TILA platform.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

## Development

### Quick Start

1. **Start all services** (app + PostgreSQL):
   ```bash
   docker-compose -f docker-compose.dev.yaml up --build
   ```

2. **Access the application**:
   - Web: http://localhost:3000
   - PostgreSQL: localhost:5432

### Development Workflow

The development setup includes:
- **Hot-reload**: Changes to source files automatically rebuild
- **Volume mounting**: Source code is mounted for live editing
- **Database persistence**: PostgreSQL data persists in Docker volume

### Common Commands

```bash
# Start services
docker-compose -f docker-compose.dev.yaml up

# Rebuild and start
docker-compose -f docker-compose.dev.yaml up --build

# View logs
docker-compose -f docker-compose.dev.yaml logs -f app

# Stop services
docker-compose -f docker-compose.dev.yaml down

# Remove volumes (reset database)
docker-compose -f docker-compose.dev.yaml down -v
```

### Inside the Container

```bash
# Access the running container
docker-compose -f docker-compose.dev.yaml exec app sh

# Run Prisma commands inside container
docker-compose -f docker-compose.dev.yaml exec app bunx --bun prisma studio
docker-compose -f docker-compose.dev.yaml exec app bunx --bun prisma db push
```

### Environment Configuration

Development environment variables are set in `docker-compose.dev.yaml`:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: http://localhost:3000
- `NEXTAUTH_SECRET`: Development secret (change in production)

## Production

### Quick Start

1. **Create production `.env` file**:
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your production values
   ```

2. **Start production services**:
   ```bash
   docker-compose -f docker-compose.prod.yaml --env-file .env.production up -d --build
   ```

### Production Features

- **Optimized builds**: Multi-stage builds for smaller image size
- **Health checks**: PostgreSQL health check before app starts
- **Restart policy**: Services restart automatically on failure
- **Environment variables**: Production secrets from `.env.production`

### Production Environment Variables

Required in `.env.production`:
```bash
# Database
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=tila

# Application
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-random-secret

# Email (optional)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_ADDRESS="TILA <noreply@yourdomain.com>"

# Self-hosted mode (optional)
ALLOW_UNVERIFIED_USER=false
```

## Architecture

### Development (`Dockerfile.dev`)

**Multi-stage build:**
1. **deps**: Install dependencies with Bun
2. **builder**: Build application and generate Prisma client
3. **development**: Run development server with hot-reload

**Features:**
- Base: `node:20-alpine` (lightweight Linux)
- Package manager: Bun
- Hot-reload enabled via volume mounts
- Source code mounted for live editing

### Production (`Dockerfile`)

**Optimized multi-stage build:**
1. **deps**: Install dependencies
2. **builder**: Build production-optimized application
3. **runner**: Minimal runtime image

**Features:**
- Minimal image size
- Optimized production build
- No development dependencies
- Security best practices

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker-compose -f docker-compose.dev.yaml logs app

# Rebuild from scratch
docker-compose -f docker-compose.dev.yaml build --no-cache
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose -f docker-compose.dev.yaml ps

# View database logs
docker-compose -f docker-compose.dev.yaml logs postgres

# Restart database
docker-compose -f docker-compose.dev.yaml restart postgres
```

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Change port in docker-compose.dev.yaml:
# ports:
#   - "3001:3000"  # Use localhost:3001 instead
```

### Reset Everything

```bash
# Stop and remove all containers, volumes, and images
docker-compose -f docker-compose.dev.yaml down -v
docker system prune -a

# Rebuild from scratch
docker-compose -f docker-compose.dev.yaml up --build
```

## Performance Tips

### Development
- Use `--turbo` flag in Dockerfile.dev for faster builds with Turbopack
- Increase Docker resources: Settings → Resources → 4GB+ RAM
- Use `.dockerignore` to exclude unnecessary files

### Production
- Use multi-stage builds to reduce image size
- Run database on separate host in production
- Enable Docker BuildKit for faster builds: `DOCKER_BUILDKIT=1`

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use secrets management** for production (Docker Secrets, AWS Secrets, etc.)
3. **Change default passwords** in production
4. **Run as non-root user** in production (already configured)
5. **Keep images updated**: `docker-compose pull` regularly

## Additional Resources

- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Official](https://hub.docker.com/_/postgres)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
