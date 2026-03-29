# Teddy Open Finance Challenge

## How to run locally

```bash
# Raising infra and runnning migrations
docker compose up -d 
dbmate --url "postgres://admin_user:root_passsword@localhost:5432/teddy-challenge?sslmode=disable" up

# Running projects
nx serve api
nx dev front
```

## How to reset everything
```bash
docker compose down
docker volume prune --all --force
```