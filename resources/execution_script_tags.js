module.exports = {
    inputdownloading: [
        {
            "name": "googleapis",
            "docker_tag": "googleapis",
            "docker_repository":"fogbow/inputdownloader"
        },
        {
            "name": "usgsapis",
            "docker_tag": "usgsapis",
            "docker_repository":"fogbow/inputdownloader"
        }
    ],
    preprocessing: [
        {
            "name":"default",
            "docker_tag":"default",
            "docker_repository":"fogbow/preprocessor"
        },{
            "name":"legacy",
            "docker_tag":"legacy",
            "docker_repository":"fogbow/preprocessor"
        }
    ],
    processing: [
        {
            "name":"ufcg-sebal",
            "docker_tag":"ufcg-sebal",
            "docker_repository":"fogbow/worker"
        },{
            "name":"sebkc-sebal",
            "docker_tag":"sebkc-sebal",
            "docker_repository":"fogbow/worker"
        },{
            "name":"sebkc-tseb",
            "docker_tag":"sebkc-tseb",
            "docker_repository":"fogbow/worker"
        }      
    ]
}