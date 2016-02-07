FROM	armhfbuild/debian

MAINTAINER Automattic

WORKDIR /calypso

RUN     mkdir -p /tmp
COPY    ./env-config.sh /tmp/
RUN     bash /tmp/env-config.sh
RUN     apt-get -y update && apt-get -y install \
          wget \
          git \
          python \
          make \
          build-essential

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs

ENV     NODE_PATH /calypso/server:/calypso/client

# Install base npm packages to take advantage of the docker cache
COPY    ./package.json /calypso/package.json
RUN     npm install --production

COPY     . /calypso

# Build javascript bundles for each environment and change ownership
RUN     CALYPSO_ENV=wpcalypso make build-wpcalypso && \
          CALYPSO_ENV=horizon make build-horizon && \
          CALYPSO_ENV=stage make build-stage && \
          CALYPSO_ENV=production make build-production && \
          chown -R nobody /calypso

USER    nobody
CMD     NODE_ENV=production node build/bundle-$CALYPSO_ENV.js
