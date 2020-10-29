#!/bin/bash

readonly DASHBOARD_APP_FILE_PATH="/dashboard/public/dashboardApp.js"
readonly DASHBOARD_CONFIG_PATH="/dashboard/backend.config"
readonly EXECUTION_SCRIPT_TAGS_PATH="/etc/saps/execution_script_tags.json"
readonly TEMP_FILE_PATH="/tmp/contants"
readonly EXECUTION_SCRIPT_TAGS_CONTENT=$(jq '.' ${EXECUTION_SCRIPT_TAGS_PATH})
readonly DISPATCHER_HOST=$(jq -r '.saps.host' ${DASHBOARD_CONFIG_PATH})
readonly DISPATCHER_PORT=$(jq -r '.saps.port' ${DASHBOARD_CONFIG_PATH})
readonly DISPATCHER_ADDRESS="${DISPATCHER_HOST}:${DISPATCHER_PORT}/"

setConfigs() {
  gawk -i inplace '/\/\/Initializing controllers module./{p=1}p' ${DASHBOARD_APP_FILE_PATH}

  DASHBOARD_APP_FILE_CONTENT=$(cat ${DASHBOARD_APP_FILE_PATH})

  cat > ${TEMP_FILE_PATH} << EOF
var app = angular.module('schedulerDashboard', [
    'dashboardControllers',
    'dashboardServices',
    'ngSanitize',
    'ngRoute'
    //'ui.bootstrap'
]);

let scriptsTags = ${EXECUTION_SCRIPT_TAGS_CONTENT};

app.constant("appConfig", {
    "urlSapsService": "${DISPATCHER_ADDRESS}",
    "authPath": "users?auth",
    "authCreatePath":"users?register",
    "submissionPath": "processings",
    "regionDetailsPath": "regions/details",
    "imagesProcessedSearch":"regions/search",
    "emailPath": "email",
    "LOGIN_SUCCEED": "login.succeed",
    "LOGIN_FAILED": "login.failed",
    "LOGOUT_SUCCEED": "logout.succed",
    "DEFAULT_SB_VERSION": "version-001",
    "DEFAULT_SB_TAG": "tag-001",
    "SATELLITE_OPTS": [{
        "label": "Landsat 4",
        "value": "l4"
    }, {
        "label": "Landsat 5",
        "value": "l5"
    }, {
        "label": "Landsat 7",
        "value": "l7"
    }],
    "MODAL_OPENED": "modalOpened",
    "MODAL_CLOSED": "modalClosed",
    "scriptsTags": scriptsTags
});
EOF

  cat > ${DASHBOARD_APP_FILE_PATH} << EOF
$(cat ${TEMP_FILE_PATH})
${DASHBOARD_APP_FILE_CONTENT}
EOF

  rm ${TEMP_FILE_PATH}
}

setConfigs
pm2 start /dashboard/app.js
service nginx restart
pm2 logs app