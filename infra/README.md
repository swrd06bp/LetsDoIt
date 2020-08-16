# Dependencies

Make sure to have docker and docker-compose installed



# Installation


Install the other repos
```sh
./install.sh
```

Create an external docker network
```sh
docker network create nat
```

# Congiguration

Go to the file ini-letsencrypt and change
```sh
domains=(your_domain)
```

Go to nginx/conf.d/default.conf and change the domain on the file.
Also pay attention to the server port 80


# Install and Launch the application

```sh
sudo ./init-letsencrypt.sh
```


