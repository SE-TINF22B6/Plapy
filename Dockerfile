FROM node:16.14

ENV USER=plapy

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove

# create evobot user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/plapy -r -g ${USER} ${USER}

# set up volume and user
USER ${USER}
WORKDIR /home/plapy

COPY --chown=${USER}:${USER} package*.json ./
RUN npm install
VOLUME [ "/home/plapy" ]

COPY --chown=${USER}:${USER}  . .

ENTRYPOINT [ "npm", "run", "prod" ]
