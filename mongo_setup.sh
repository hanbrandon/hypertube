#!/bin/bash
docker-machine create --driver virtualbox mongoDb
docker-machine start mongoDb
eval $(docker-machine env mongoDb)
echo "ifconfig eth1 192.168.99.100 netmask 255.255.255.0 broadcast 192.168.99.255 up" | docker-machine ssh mongoDb sudo tee /var/lib/boot2docker/bootsync.sh > /dev/null
docker-machine restart mongoDb
echo "kill `more /var/run/udhcpc.eth1.pid`\nifconfig eth1 192.168.99.100 netmask 255.255.255.0 broadcast 192.168.99.255 up" | docker-machine ssh mongoDb sudo tee /var/lib/boot2docker/bootsync.sh > /dev/null
docker-machine regenerate-certs -f mongoDb
eval $(docker-machine env mongoDb)
docker run --name mongo_db --publish  27017:27017 -e MONGO_INITDB_ROOT_USERNAME='root' -e MONGO_INITDB_ROOT_PASSWORD='root' -d mongo
docker start mongo_db
docker exec -it mongo_db /bin/bash

# mongo -uroot -proot
# use hypertube
# db.createUser({ user:"root", pwd:"root", roles:[{ "role" : "dbOwner", "db" : "hypertube" }] })
# exit
# mongo --port 27017 -u root -p root --authenticationDatabase hypertube
# use hypertube
#
