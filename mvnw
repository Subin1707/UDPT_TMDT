#!/usr/bin/env sh
BASE_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MAVEN="$BASE_DIR/.tools/apache-maven-3.9.15/bin/mvn"
SYSTEM_MAVEN="/e/apache-maven-3.9.15/bin/mvn"
LOCAL_REPO="$BASE_DIR/.m2/repository"

if [ -x "$MAVEN" ]; then
  exec "$MAVEN" "-Dmaven.repo.local=$LOCAL_REPO" "$@"
fi

if [ -x "$SYSTEM_MAVEN" ]; then
  exec "$SYSTEM_MAVEN" "-Dmaven.repo.local=$LOCAL_REPO" "$@"
fi

exec mvn "$@"
