# Quizlord Client

Simple PWA to share newspaper quizzes between friends, including scores and stats

## Local Development

Doppler is used to provide access to secrets, in order to run the app you first need to run

- `doppler login`
- `doppler setup`

## Using Nix

If using nixos a flake file is provided to load a shell with all the required dependencies.

```sh
nix develop
```

## Bootstrap project

```sh
npm ci
```

## Run project

```sh
npm run dev
```

### Test Docker Image Locally

```sh
# Perform a local production build
npm run build
# Build a local image tagged with local
docker build -t quizlord-client:local .
# Push a local env file using doppler
doppler secrets download --no-file --format docker > .env
# Run local build using the env file
docker run --rm -p 3000:80 --env-file=.env --name=quizlord-client quizlord-client:local
# Cleanup
docker image rm quizlord-client:local
rm .env
```

### Test Helm Locally

1. You first to have a local k8s cluster running.
2. Ensure doppler is setup with `doppler setup`
3. Install the doppler operator as described https://docs.doppler.com/docs/kubernetes-operator
4. Create the doppler token secret
   ```sh
   kubectl create secret generic doppler-token-quizlord-client-secret \
   --namespace doppler-operator-system \
   --from-literal=serviceToken=$(doppler configs tokens create doppler-kubernetes-operator --plain)
   ```
5. Create the destination namespace with `kubectl create namespace quizlord`
6. Create the doppler secret with `kubectl apply -f .k8s/doppler-secret.yaml`
7. Create the registry pull secret `kubectl create secret docker-registry registry-github-quizlord --docker-server=ghcr.io --docker-username=danielemery --docker-password=REPLACE_ME --docker-email="danielremery@gmail.com" -n quizlord`
8. Install using local chart
   ```sh
   helm install -n quizlord quizlord-client ./helm
   ```
9. Cleanup
   ```sh
   helm uninstall -n quizlord quizlord-client
   ```
