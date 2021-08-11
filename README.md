# Visio

Prototype video chat conference using Symfony, React.Js & Mercure Hub

## Dev env :
- PHP 8
- mysql 5.7
- Apache 2

## Dependencies :
- Mercure Hub
- Symfony 5
- React.js 17
- Redux 4
- MaterialUi 4
- webpack 5
- PeerJs 1

## Requierments :
- [Heroku](https://www.heroku.com) account

## Configuration

### On local
Linux based installation proccess!

Follow the [first install doc](./docs/firstInstall.md)

### On Prod
- install [peerJs server button](https://elements.heroku.com/buttons/peers/peerjs-server) on heroku
- push mercure folder on another Herokuapp
    - in the procfile change 'yourwebsite' with your site address
    - Build pack : heroku/go
    - Config vars: GOVERSION => go1.14


## Logins

|   id  	| password 	|
|:-----:	|:--------:	|
| user1 	| pass     	|
| user2 	| pass     	|
| user3 	| pass     	|