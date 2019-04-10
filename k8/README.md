docker build -f Dockerfile -t docker.app.synaltic.eu/savoirrouler/pg .
docker push docker.app.synaltic.eu/savoirrouler/pg

docker build -f Dockerfile -t docker.app.synaltic.eu/savoirrouler/front-end .
docker push docker.app.synaltic.eu/savoirrouler/front-end

docker build -f Dockerfile -t docker.app.synaltic.eu/savoirrouler/back-end .
docker push docker.app.synaltic.eu/savoirrouler/back-end