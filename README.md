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
nx e2e api-e2e # integration test, should be executing with infra raised

# Frontend 
nx test front # unit test
nx e2e front-e2e # e2e test, should be executing the backend in another terminal, make sure you reset the infra between tests
```

### How to run lint and format
```bash
# Backend
nx lint api # eslint on api
nx lint front # eslint on front
nx format api # prettier on api
nx format front # prettier on front
```

## URLs

Make sure you executed the command `make up`

- front: http://localhost:5173
- api: http://localhost:3000
- api metrics: http://localhost:8081/metrics
- prometheu: http://localhost:9090
- jaeger: http://localhost:16686
- grafana: http://localhost:3001

## Observability

In a production problem every minute counts. Observability is composed by 3 Pillars of information that can help debugging:

- Metrics: Reveal trends and triggers, such as a spike in 500 errors. Can also monitor CPU and Memory
- Logging: Reveal detailed information on what occurred at a particular time.
- Tracing: "Connects the dots" and reveals the chronological flow of a transaction. This is a very good way to debug on microservices systems