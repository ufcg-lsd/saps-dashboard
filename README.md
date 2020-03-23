# Install and Configure Dashboard

The SAPS Dashboard component is responsible for interacting with SAPS users through a graphical interface in brownser providing some services. Here are some of them:
- Submit new tasks
- Download successful tasks (seamless processing)
- View task progress
  
## Dependencies

In an apt-based Linux distro, type the below commands to install the Dashboard dependencies.

```bash
sudo apt-get update
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

In addition to the installation of the above Linux packages, the Dashboard source code should be fetched from its repository and compiled. This could be done following the below steps:

```bash
# saps-dashboard repository
git clone https://github.com/ufcg-lsd/saps-dashboard.git
cd saps-dashboard
npm install
```

## Configure

Edit the files:
- [Backend configuration file](/backend.config) allow its communication with the SAPS catalog and the graphical interface of the SAPS Dashboard component. Change in ```$dashboard_access_port``` to the port you want to use to access the dashboard graphical interface and in ```$catalog_ip_address``` for the SAPS Catalog access ip
```json
{
  	"logLevel": "DEBUG",
  	"port": $dashboard_access_port,
  	"devMode": true,
  	"saps":{
		"host" : $catalog_ip_address,
		"port" : 8091,
		"getImagesEndpoint" : "/images" 
	},
	"sattelities":[
		{"name":"sat4","sigla":"L4"},
		{"name":"sat5","sigla":"L5"},
		{"name":"sat7","sigla":"L7"}
	]
}
```

- [SAPS Scripts](/public/dashboardApp.js) to make available new versions of the algorithms, for the three steps of the SAPS workflow (input downloading, preprocessing and processing). Any new algorithm should be packed as a docker image. See below example on how to specify the algorithms:
    
```javascript
let scriptsTags =
{
    "inputdownloading":[
        {
          "name": "$name_inputdownloading_option1",
          "docker_tag": "$docker_tag_inputdownloading_option1",
          "docker_repository": "$docker_repository_inputdownloading_option1"
        }
      ],
      "preprocessing":[
        {
          "name": "$name_preprocessing_option1",
          "docker_tag": "$docker_tag_preprocessing_option1",
          "docker_repository": "$docker_repository_preprocessing_option1"
        }
      ],
      "processing":[
        {
          "name": "$name_processing_option1",
          "docker_tag": "$docker_tag_processing_option1",
          "docker_repository": "$docker_repository_processing_option1"
        },
        {
          "name": "$name_processing_option2",
          "docker_tag": "$docker_tag_processing_option2",
          "docker_repository": "$docker_repository_processing_option2"
        }
      ]
};
```
**Note: The SAPS scripts configured here must be the same as the Dispatcher component and Scheduler component**

- [SAPS Dispatcher Service URL](/public/dashboardApp.js) allows its communication with the SAPS dispatcher backend. Change in ```urlSapsService``` to ```http://$dispatcher_access_ip:$dispatcher_access_port/```. Note: The ```$dispatcher_access_port``` must be the same as the ```submission_rest_server_port``` property in the [Dispatcher component configuration file](https://github.com/ufcg-lsd/saps-engine/blob/develop/config/dispatcher.conf)

## Run

Once the configuration file is edited, the below commands are used to start and stop the Dashboard component.

```bash
# Start command
bash bin/start-dashboard
```

```bash
# Stop command
bash bin/stop-dashboard
```