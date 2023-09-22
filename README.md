# raptor

DBSWA: Dev & Production Configuration

## CLI Commands

```bash
# buid/rebuild && start docker images based on docker-compose on prod mode; running on port 7800
$ cd raptor && docker compose -f docker-compose.prod.yml up -d

# buid/rebuild && start docker images based on docker-compose on debug mode;
$ docker compose up --build

# start running images debug mode at port 7800
$ cd raptor && docker compose up 

# stop running app all modes
$ docker compose down

# clean slate docker hub
$ docker system prune -a && docker images prune -a && docker volume rm $(docker volume ls -q) && docker volume prune -a

```
