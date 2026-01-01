FROM demery/docker-react:v1.0.0

ARG IMAGE_VERSION
ENV VITE_QUIZLORD_VERSION=$IMAGE_VERSION

COPY env.schema.js ./env.schema.js
COPY dist /usr/share/nginx/html
