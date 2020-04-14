FROM node:10

WORKDIR /dashboard

COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && \
      apt-get install -y nginx && \
      npm install pm2 -g

COPY ./nginx/default /etc/nginx/sites-available/default
COPY ./docker/entrypoint.sh /

EXPOSE 80

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]