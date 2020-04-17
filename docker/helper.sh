#!/bin/bash

readonly DASHBOARD_REPO=wesleymonte/saps-dashboard

build() {
  local DOCKERFILE_DIR=docker/dockerfile
  local TAG="${1-latest}"
  docker build --tag "${DASHBOARD_REPO}":"${TAG}" \
          --file "${DOCKERFILE_DIR}" .
}

run() {
  local TAG="${1-latest}"
  local PORT="${2-80}"
  local CONTAINER_NAME="saps-dashboard"
  docker run -dit \
    --name "${CONTAINER_NAME}" \
    -p ${PORT}:80 \
    -v "$(pwd)"/public/dashboardApp.js:/dashboard/public/dashboardApp.js \
    -v "$(pwd)"/backend.config:/dashboard/backend.config  \
    "${DASHBOARD_REPO}":"${TAG}"
}

define_params() {
  case $1 in
    build)
      build $2
      ;;
    run)
      run $2 $3
      ;;
  esac
}

define_params "$@"