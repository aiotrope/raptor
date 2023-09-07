# raptor

DBSWA: Dev & Production Configuration

## CLI Commands

```bash
# start app at the root directory; application running on port 7800 (production); first run
$ cd raptor && docker compose -f docker-compose.prod.yml -d

# start app at the root directory; application running on port 7800 (dev)
$ cd raptor && docker compose up 

# stop running app
$ docker compose down

# start app on succeeding run 
$ docker compose up

```
