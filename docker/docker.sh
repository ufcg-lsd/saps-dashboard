#!/bin/bash

readonly DASHBOARD_REPO=wesleymonte/saps-dashboard
readonly DASHBOARD_CONTAINER=saps-dashboard
readonly DASHBOARD_PORT=8081

build() {
  local DOCKERFILE_DIR=docker/dockerfile
  local TAG="${1-latest}"
  docker build --tag "${DASHBOARD_REPO}":"${TAG}" \
          --file "${DOCKERFILE_DIR}" .
}

run() {
  local TAG="${1-latest}"
  docker run -dit \
    --name "${DASHBOARD_CONTAINER}" \
    -p ${DASHBOARD_PORT}:80 \
    -v "$(pwd)"/public/dashboardApp.js:/dashboard/public/dashboardApp.js \
    -v "$(pwd)"/backend.config:/dashboard/backend.config  \
    "${DASHBOARD_REPO}":"${TAG}"
}

define_params() {
  case $1 in
    build) shift
      build "$@"
      ;;
    run) shift
      run "$@"
      ;;
  esac
}

define_params "$@"