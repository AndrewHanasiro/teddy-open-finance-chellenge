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

## How to run test
```bash
# Backend
nx test api # unit test
nx e2e api-e2e # e2e test

# Frontend 
nx test front # unit test
nx e2e front-e2e # e2e test
```

## How to run lint
```bash
# Backend
nx lint api # unit test
```