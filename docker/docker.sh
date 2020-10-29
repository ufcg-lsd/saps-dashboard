#!/bin/bash

readonly REPOSITORY=ufcgsaps/dashboard
readonly MY_PATH=$(cd "$(dirname "${0}")" || { echo "For some reason, the path is not accessible"; exit 1; }; pwd )
readonly WORKING_DIRECTORY="$(dirname "${MY_PATH}")"
readonly DOCKER_FILE_PATH="${MY_PATH}/Dockerfile"

readonly CONFIG_FILE_PATH="${WORKING_DIRECTORY}/backend.config"
readonly EXECUTION_TAGS_FILE_PATH="${WORKING_DIRECTORY}/execution_script_tags.json"

readonly DASHBOARD_CONTAINER=saps-dashboard
readonly DASHBOARD_PORT=8081

build() {
  local TAG="${1-latest}"
  docker build --tag "${REPOSITORY}":"${TAG}" \
          --file "${DOCKER_FILE_PATH}" "${WORKING_DIRECTORY}"
}

run() {
  local TAG="${1-latest}"
  docker run -dit \
    --name "${DASHBOARD_CONTAINER}" \
    -p ${DASHBOARD_PORT}:80 \
    -v "${CONFIG_FILE_PATH}":/dashboard/backend.config \
    -v "${EXECUTION_TAGS_FILE_PATH}":/etc/saps/execution_script_tags.json  \
    "${REPOSITORY}":"${TAG}"
}

push() {
  local TAG="${1-latest}"
  docker push "${REPOSITORY}":"${TAG}"
}

define_params() {
  case $1 in
    build) shift
      build "$@"
      ;;
    run) shift
      run "$@"
      ;;
    push) shift
      push "$@"
      ;;
    publish) shift
      build "$@"
      push "$@"
  esac
}

define_params "$@"