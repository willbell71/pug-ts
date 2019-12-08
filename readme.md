# PUG Template Rendering Express Server

Renders PUG templates for endpoints.

/ - renders home template.
* - renders 404 template.

## Build Docker image

>`sudo docker build . -t pug-ts`

`build .` use the Dockerfile in the current folder to build the image from, ensure this command is executed in the same folder as the Dockerfile
`-t` to tag the image, this is required when starting a container, so the container knows which image to use

## Start a container from the image

>`sudo docker run -it -p3000:3000 --name pug-ts pug-ts`

`-it` will run the container in the foreground and show tty ( stdout, stderr )
`-p3000:3000` will map the containers port 3000 to the local port 3000, important if you want to connect to the container :/
`--name pug-ts` name the container instance, helpful for running exec commands later, see below
`pug-ts` use the image tag that the container should be run from

## Shell into running container

>`sudo docker exec -it pug-ts /bin/bash`

`-it` iteractive with tty
`pug-ts` container name, as specified by `--name` when running `run`
`/bin/bash` shell to use, if an alpine image it must be `/bin/sh`
