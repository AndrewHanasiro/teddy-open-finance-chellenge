.PHONY: up down reset

DB_URL := "postgres://admin_user:root_passsword@localhost:5432/teddy-challenge?sslmode=disable"

up:
	docker compose up -d
	sleep 2
	dbmate --url $(DB_URL) up
down:
	docker compose down
	docker volume prune --all --force

reset:
	make down
	make up