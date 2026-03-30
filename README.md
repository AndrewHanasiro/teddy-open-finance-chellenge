# Teddy Open Finance Challenge

## Commands

### How to run locally

```bash
# Raising infra and runnning migrations
docker compose up -d 
dbmate --url "postgres://admin_user:root_passsword@localhost:5432/teddy-challenge?sslmode=disable" up

# Shorcut for the commands above
make up

# Running projects
nx serve api
nx dev front


```

### How to reset everything
```bash
docker compose down
docker volume prune --all --force

# Shorcut for the commands above
make down

# Shorcut if you want to reset the infra by destroy and raising again
make reset
```

### How to run test
```bash
# Backend
nx test api # unit test
nx e2e api-e2e # e2e test

# Frontend 
nx test front # unit test
nx e2e front-e2e # e2e test, should be executing the backend in another terminal, make sure you reset the infra
```

### How to run lint
```bash
# Backend
nx lint api # unit test
```

## URLs
front: http://localhost:5173
api: http://localhost:3000
prometheu: http://localhost:9090
jaeger: http://localhost:16686
grafana: http://localhost:3001

