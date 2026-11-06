-include .env
export

PROJECT_NAME ?= prim8
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
clean:      ## Stop and remove containers, volumes and the project's built images
	docker compose down -v
	-docker image rm $$(docker compose config --images | grep '^$(PROJECT_NAME)-')
