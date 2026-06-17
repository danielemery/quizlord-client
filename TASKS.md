# TASKS — Adopt the `github-release-actions` CI/CD pattern

Bring this SPA's CI/CD in line with the API (`danielemery/quizlord-api`), which now drives releases
from **semver PR labels** via [`danielemery/github-release-actions`](https://github.com/danielemery/github-release-actions)
instead of "push a `vX.Y.Z` tag → publish".

## Target pattern (as implemented in quizlord-api)

| Stage | Trigger | What happens |
| --- | --- | --- |
| `validate-pr` | PR opened/labeled/synced | Gate: PR must carry exactly one `semver:major\|minor\|patch` label (`validate-semver-label`). |
| `ci` | PR → main | Lint (API also runs tests + Codecov; see divergences). |
| `docker-build` | PR → main | `npm run build` + `docker build` with **no push** — catches a broken Dockerfile/build at PR time. |
| `release-candidate` | PR **closed & merged** → main | `calculate-prerelease-version` (id `rc`) → build → docker push → helm publish → `create-prerelease` (tag **last**). Serialized via `concurrency: {group: release, queue: max}`. |
| `release-stable` | `workflow_dispatch` (input: rc version) | `perform-pre-release` (`promote-to-stable: true`) → retag image rc→stable → helm at stable → retag `latest` last → `perform-post-release` (publish + delete intermediate rc releases/tags). Same `release` concurrency lane. |

Pin release actions at **`@v0.5.1`** (the version the API uses).

## Divergences from the API (this is a SPA, not the API)

- **No tests.** `package.json` `test` is a stub (`echo 'Test not yet implemented'`). So: **omit Codecov,
  `main.yml`, and `test:ci`.** `ci.yml` runs lint only. (Add tests + coverage in a later PR — see Follow-ups.)
- **Sentry deferred** to a follow-up PR (operator decision) — see Follow-ups. RC stays staging-only artifacts; no sourcemap asset on the prerelease, so `create-prerelease` is just the tag-last step.
- **Artifact contents differ:** upload `dist`, `env.schema.js`, `Dockerfile`, `.dockerignore` (not the API's `prisma`/`package*.json`). `Dockerfile` is `FROM demery/docker-react` and `COPY`s `dist` + `env.schema.js`.
- **Drop** `check-version-format-action` and `docker/metadata-action` — the new pattern tags the image
  explicitly with the calculated version and handles `latest` via the stable-promotion retag.

## Prerequisites (operator-owned — all confirmed done)

- [x] Create repo labels `semver:major`, `semver:minor`, `semver:patch` on `danielemery/quizlord-client`.
- [x] Confirm a base GitHub **release** exists for version calculation (the old tag-push flow already
      produced `vX.Y.Z` tags; verify the latest stable is a real *release*, not just a tag).
- [x] Confirm GHCR "Manage Actions access" still grants this repo write to the `quizlord-client` package
      (already true for the old `publish.yml`; just re-confirm).
- [x] Existing secrets/vars reused as-is: `HELM_DEPLOY_ACCESS_KEY`, `HELM_DEPLOY_SECRET`,
      `vars.HELM_DEPLOY_REGION`. No new secrets needed (Sentry deferred).
- [x] Decide merge settings are compatible: `release-candidate` fires on `pull_request: closed` + merged.

## Tasks

Grouped into commit-sized units (one logical change per commit).

### 1. PR-time workflows
- [x] Replace `.github/workflows/validate-pr.yaml` with a `validate-semver-label` gate
      (`uses: danielemery/github-release-actions/validate-semver-label@v0.5.1`,
      `on: pull_request: types [opened, reopened, labeled, unlabeled, synchronize]`).
- [x] Add `.github/workflows/ci.yml` — `on: pull_request → main`; job: checkout → setup-node (24.16.0)
      → `npm ci` → `npm run lint`. (No tests/Codecov — see divergences.)
- [x] Add `.github/workflows/docker-build.yml` — `on: pull_request → main`; checkout → setup-node →
      `npm ci` → `npm run build` → `docker/build-push-action@v7.2.0` with `push: false`.

### 2. Release-candidate workflow
- [x] Add `.github/workflows/release-candidate.yml`:
  - `on: pull_request: types [closed], branches [main]`; every job guarded `if: github.event.pull_request.merged == true`.
  - `permissions: contents: read` at top; per-job write scopes only where needed.
  - `concurrency: {group: release, queue: max}`.
  - `version` job → `calculate-prerelease-version@v0.5.1` (`prerelease-identifier: rc`); expose
    `version`, `tag`, `base-version` outputs.
  - `build` job → `npm ci` + `npm run build`; upload `build-artifacts` (`dist`, `env.schema.js`,
    `Dockerfile`, `.dockerignore`) and `helm-chart` (`helm`).
  - `docker-publish` job (`packages: write`) → download artifacts → `docker/login-action@v4.2.0` →
    `docker/build-push-action@v7.2.0` tag `ghcr.io/${{github.repository}}:${{needs.version.outputs.version}}`,
    `build-args: IMAGE_VERSION=${{needs.version.outputs.base-version}}` — baked **fallback only**; the
    real per-env version is injected at runtime via helm (see §4).
  - `helm-publish` job → download `helm-chart` → `aws-actions/configure-aws-credentials@v6.1.2` →
    `danielemery/helm-release-action@f19adb8…` (`repo s3://helm.demery.net/`, `version`/`appVersion` = rc `version`).
  - `create-prerelease` job (`contents: write`, `needs:` all above) →
    `create-prerelease@v0.5.1` (`release-version: tag`). **Tag last** so the tag never points at a commit
    whose artifacts failed to publish.

### 3. Release-stable workflow
- [x] Add `.github/workflows/release-stable.yml`:
  - `on: workflow_dispatch` with input `prerelease_version` (e.g. `v1.2.3-rc.2`).
  - Same `concurrency: {group: release, queue: max}` lane.
  - `pre_release` (`contents: write`) → `perform-pre-release@v0.5.1` (`release-version: <input>`,
    `promote-to-stable: true`); output `release-id`, `release-tag`, `release-version`.
  - `retag-image` (`packages: write`) → GHCR login → `docker buildx imagetools create` retag the rc
    image to the stable version (immutable tag only).
  - `helm-stable` → `actions/checkout` `ref: <input>` → aws creds → `helm-release-action` at stable version.
  - `retag-latest` (`packages: write`, `needs: pre_release, retag-image, helm-stable`) → point `latest`
    at the stable image **last**, so `latest` only moves once all artifacts succeed.
  - `post_release` (`contents: write`, `needs: pre_release, retag-latest`) →
    `perform-post-release@v0.5.1` (`release-id`) — publishes the stable release, deletes intermediate rc releases/tags.

### 4. Helm: inject runtime version (align with API's `API_VERSION` pattern)
- [ ] Fix `helm/templates/deployment.yaml`: the container env currently sets `VITE_CLIENT_VERSION` from
      `.Values.client.version`, but that name isn't in `env.schema.js` and nothing reads it, so
      `docker-react` drops it — the runtime override is a **no-op** today (displayed/Sentry version always
      falls back to the baked `IMAGE_VERSION`). Rename it to **`VITE_QUIZLORD_VERSION`** (the schema var
      the Footer + Sentry read) so the deployed version wins at runtime, exactly like the API injects
      `API_VERSION` from `.Values.api.version`. This is what makes the baked `base-version` a mere fallback.
- [ ] Commit separately from the workflow changes (chart change, distinct logical unit).

### 5. Remove the old flow & docs
- [ ] Delete `.github/workflows/publish.yml` (tag-push-driven; fully replaced by §2 + §3).
- [ ] Update `README.md` (and any release/runbook notes) to describe the new label-driven rc → manual
      stable-promotion flow.

## Follow-ups (separate PRs, out of scope for this branch)

- [ ] **Sentry releases + sourcemaps.** Enable sourcemaps in `vite build`; add `SENTRY_AUTH_TOKEN`
      secret + `SENTRY_ORG`/`SENTRY_PROJECT` vars; add a `sentry` job to `release-candidate.yml`
      (`getsentry/action-release@v3.6.1`, env `stg`, release keyed on full rc version) and a
      `sentry-stable` job to `release-stable.yml` (re-upload the rc sourcemaps under the stable version,
      env `prod`). This also means `create-prerelease` should attach the sourcemaps tarball as a release
      asset so promotion can re-upload without rebuilding (as the API does).
- [ ] **Tests + Codecov.** Once real tests exist, add `test:ci`, a Codecov upload to `ci.yml`, and a
      `main.yml` coverage-push workflow — matching the API.

## Decisions (all resolved)

- ✅ Prerelease identifier: **`rc`** (match the API) → `vX.Y.Z-rc.N`.
- ✅ Docker `IMAGE_VERSION` build-arg: bake **`base-version`** as a fallback only. The accurate per-env
  version is injected at runtime by helm (§4), mirroring the API's `API_VERSION` pattern — so staging
  shows `1.2.3-rc.N` and prod shows the clean `1.2.3` without rebuilding.
- ✅ `ci.yml` scope: **lint-only**. `tsc` is already exercised by `docker-build.yml`'s `npm run build`
  on every PR, so a second build would be wasted CI minutes for no added safety.
