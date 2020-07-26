# Dependencies

Make sure to have docker and docker-compose installed



# Installation

Clone the repo infra
```sh
mkdir sports
cd sports
git clone https://github.com/swrd06bp/sports_infra.git 
cd sports_infra
```

Install the other repos
```sh
./install.sh
```

Create an external docker network
```sh
docker network create nat
```

# Configuration

Create certificate for the nginx
```sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/cert/nginx-selfsigned.key -out nginx/cert/nginx-selfsigned.crt
```

# Launch the application

```sh
docker-compose up -d --build  -scale specific=3
```


