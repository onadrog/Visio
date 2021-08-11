# First install :

## Requirements:

- [Mkcert](https://github.com/FiloSottile/mkcert)
- [Docker](https://docs.docker.com/get-docker)

- install [peerJs server button](https://elements.heroku.com/buttons/peers/peerjs-server) on heroku
- install mkcert for localhost and paste the generated files localhost.pem & localhost-key.pem into the `cert` folder under the `docker` directory
  ```bash
  $    cd docker && cp ~/localhost.pem  ~/localhost-key.pem ./cert/
  ```

## Configuration:

To start this project on localost run the following commands:

First install dependencies:

```bash
$   cd visio && yarn && yarn build
or
$   cd visio && npm i && npm run build
```

Build the docker container, install composer dependencies and create database:

```bash
$   cd docker && docker-compose --build -d
$   docker exec -it php_fpm bash
$   composer i
$   php bin/console doctrine:database:create && php bin/console doctrine:migrations:migrate && php bin/console doctrine:fixtures:load
```
Type 'yes' on every doctrine prompt

Change `host` value at line 47 in [visio/assets/peerHooks.js](../visio/assets/peerHooks.js#L-47:C-12) with your Heroku app url.

Login into [localhost](https://localhost) and start chatting with your team.

To start a conference click on the phone icon on left upper corner.

## on mobile :

[adb](https://developer.android.com/studio/command-line/adb) is required

1. Connect your device, run:

```bash
$   adb devices
```

2. open chrome://inspect in chrome desktop browser add localhost:5000 in "Port forwarding".

3. On mobile open https://localhost:5000 login click on the user icon on the left upper corner to open the drawer and click on the phone icon.
