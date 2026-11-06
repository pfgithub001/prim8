-include .env
export

S ?= nextjs

.PHONY: build up down logs shell ps clean

build:      ## Build images
	docker compose build
up:         ## Start the stack in background
	docker compose up -d
down:       ## Stop the stack
	docker compose down
logs:       ## Follow logs
	docker compose logs -f
shell:      ## Shell into a service: make shell S=<service>
	docker compose exec $(S) sh
ps:         ## Show services status
	docker compose ps
clean:      ## Stop and remove containers, volumes and local images
	docker compose down -v --rmi local
