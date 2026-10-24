#!/usr/bin/env bash
set -euo pipefail

kind="${1:?component required}"
current="${2:?release path required}"
archive="${3:?archive required}"
digest="${4:?checksum required}"
revision="${5:?revision required}"
case "$kind" in
  backend)
    expected=/home/mitra-p24/hit/releases/sikouta-be/current
    service=sikouta-api.service
    environment=/etc/sikouta/backend.env
    port=33111
    health=http://127.0.0.1:33111/health
    entry=sikouta-be
    ;;
  frontend)
    expected=/home/mitra-p24/hit/releases/sikouta-fe/current
    service=sikouta-web.service
    environment=/etc/sikouta/frontend.env
    port=33101
    health=http://127.0.0.1:33101/api/health
    entry=server.js
    ;;
  *) echo "Unknown component" >&2; exit 1 ;;
esac
test "$current" = "$expected"
[[ "$archive" == /tmp/sikouta-"$kind"-*.tgz ]]
[[ "$digest" =~ ^[a-f0-9]{64}$ ]]
[[ "$revision" =~ ^[a-f0-9]{40}$ ]]
test -f "$environment"
test "$(uname -m)" = x86_64
test "$(sha256sum "$archive" | cut -d ' ' -f 1)" = "$digest"
systemctl cat "$service" >/dev/null
exec 9>/run/lock/sikouta-deploy.lock
flock -w 180 9

root="$(dirname "$current")"
install -d -m 755 "$root"
build="$(mktemp -d "$root/build-${revision:0:12}-XXXXXX")"
chmod 755 "$build"
tar -xzf "$archive" -C "$build" --no-same-owner
test -f "$build/$entry"
if [[ "$kind" == frontend ]]; then
  test -d "$build/.next/static"
  test -f "$build/public/favicon.ico"
  node_path="$(command -v node)"
  command_line="$node_path $build/server.js"
else
  chmod 755 "$build/sikouta-be"
  command_line="$build/sikouta-be"
fi
chown -R sikouta:sikouta "$build"

# Preserve the previous unit override for rollback, including the first deploy.
dropin="/etc/systemd/system/$service.d/90-github-release.conf"
install -d "$(dirname "$dropin")"
had_dropin=false
if [[ -f "$dropin" ]]; then
  cp -a "$dropin" "$build/previous-unit.conf"
  had_dropin=true
fi
rollback() {
  trap - ERR
  echo "Deployment failed; restoring previous service configuration." >&2
  if [[ "$had_dropin" == true ]]; then
    cp -a "$build/previous-unit.conf" "$dropin"
  else
    rm -f -- "$dropin"
  fi
  systemctl daemon-reload
  systemctl restart "$service"
  exit 1
}
trap rollback ERR
cat > "$dropin" <<UNIT
[Service]
WorkingDirectory=$build
EnvironmentFile=
EnvironmentFile=$environment
Environment=PORT=$port
Environment=HOSTNAME=127.0.0.1
ExecStart=
ExecStart=$command_line
UNIT
systemctl daemon-reload
systemctl restart "$service"
ready=false
for attempt in $(seq 1 45); do
  if systemctl is-active --quiet "$service" && curl --fail --silent --max-time 3 "$health" >/dev/null; then
    ready=true
    break
  fi
  sleep 2
done
test "$ready" = true
if [[ "$kind" == frontend ]]; then
  curl --fail --silent --max-time 10 http://127.0.0.1:33101/user >/dev/null
  curl --fail --silent --max-time 10 http://127.0.0.1:33101/favicon.ico >/dev/null
fi
ln -s "$build" "$root/.current-next"
mv -Tf "$root/.current-next" "$current"
trap - ERR
rm -f -- "$archive"
echo "Deployed $kind revision $revision; health check passed on port $port."
