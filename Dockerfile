FROM demery/docker-react:v0.0.3

COPY env.schema.js ./env.schema.js
COPY dist /usr/share/nginx/html
