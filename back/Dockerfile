FROM node:6.2

MAINTAINER Jean-Louis Rigau <jlrigau@xebia.fr>

RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

RUN apt-get update
RUN apt-get install bcrypt node-gyp -y --force-yes

RUN mkdir /skills

WORKDIR /skills

EXPOSE 8080

COPY bootstrap.sh bootstrap.sh

COPY database/migrations migrations
COPY database/database.json database.json

# COPY node_modules node_modules
COPY configuration.json configuration.json
COPY src src
COPY package.json package.json

# RUN npm remove bcrypt

# Install dependencies from package.json
# RUN npm install

ENTRYPOINT ["/skills/bootstrap.sh"]
