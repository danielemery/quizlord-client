# Quizlord Client

Simple PWA to share newspaper quizzes between friends, including scores and stats

## Local Development

Doppler is used to provide access to secrets, in order to run the app you first need to run

- `doppler login`
- `doppler setup`

### Test Docker Image Locally

```sh
# Perform a local production build
npm run build
# Build a local image tagged with local
docker build -t quizlord-client:local .
# Run local build using the env file
docker run -p 3000:80 --env-file <(doppler secrets download --no-file --format docker) --name=quizlord-client quizlord-client:local
# Cleanup
docker rm quizlord-client && docker image rm quizlord-client:local
```
