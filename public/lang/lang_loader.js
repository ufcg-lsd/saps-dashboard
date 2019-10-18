(function init() {

    var default_lang = 0;

    var langAvailable = [{
        langName: "English",
        langShortName: "Eng",
        img: "lang-icon-usa.png",
        content: {
            buttons: {
                ok: "Ok",
            },
            messages: {
                sendEmailSuccess: "Sent successfully,<br>check your email box.",
                successNewSubmission: 'Successfully submitted.',
                failedNewSubmission: 'Failed to submit.',
                unauthorizedNewSubmission: 'Unauthorized submission.',
                failCoordinatesRequired: "Coordinates are required",
                failCoordinatesNotNumber: "Coordinates are not numbers",
                failInitialDateRequired: "Initial date is required",
                failFinalDateRequired: "Final date is required",
                failDateInvalid: "Last year date must be greater than first year date",
                failPriorityRange: "Priority value must be between 1 and 100",
                noResultSearch: "There were no results for this search."
            },
            login: {
                placeholdName: "NAME/EMAIL",
                placeholdEmail: "PASSWORD",
                buttonEnter: "Enter",
                forgotPassword: "Forgot your password?",
                createAccount: "Create new Account",
            },
            createAccount: {
                title: "Create Account",
                labels: {
                    name: "Name",
                    email: "E-mail",
                    password: "Password",
                    confirmPassword: "Confirm password",
                },
                buttons: {
                    create: "Create Account",
                },
            },
            navbar: {
                menu: {
                    button1: "Processing",
                    button2: "Data",
                    button3: "Help",
                    logout: "Logout",
                    langopt: "Language",
                    settings: "Settings",
                }
            },
            heatMap: {
                label: "Number of processed images",
                infoTo: "to",
            },
            mapFeature: {
                searchBox: {
                    title: "Search",
                    label: {
                        generalSearch: "Keywords or TAG",
                        detailSearch: "Detailed search",
                        region: "Region",
                        firstDate: "Initial date",
                        lastDate: "Final date",
                        preProcessingScript: "Pre-processing script",
                        processingScript: "Processing script",
                        satellite: "Satellites",
                        loadSearch: "Processing search..."
                    },
                    button: {
                        clear: "Clear search",
                        search: "Search",
                    },
                    raioButton: {
                        default: "Default",
                        other: "Other",
                    }
                },
                submissionBox: {
                    title: "New Processing",
                    label: {
                        submissionName: "Name",
                        submissionTags: "Tags",
                        firstDate: "Initial date",
                        lastDate: "Final date",
                        region: "Region",
                        sapsVersion: "Pre-processing script",
                        sapsTag: "Processing script",
                        satellite: "Satellites",
                        requiredField: "Required Field",
                        loadSubmission: "Processing submission..."
                    },
                    button: {
                        submit: "Process",
                    },
                    raioButton: {
                        default: "Default",
                        other: "Other",
                    }
                },
                regionDetailBox: {
                    title: "Region details",
                    emailInfo: "Click <b>Send email</b> to Receive in Your Email Box <br>only the links from selected areas",
                    button: {
                        sendMail: "Send Email",
                    },
                    label: {
                        regionName: "Region",
                    },
                },
            },
            infos: {
                regionSearchFilter: {
                    info: "For add more regions use \";\".",
                    eg: "Eg: region1;region2",
                }
            },
            submissionsList: {
                steps: {
                    title: "Steps until download completion",
                    downloading: "Downloading",
                    downloaded: "Downloaded",
                    queued: "Queued",
                    fetched: "Fetched",
                },
                button: {
                    newSubmission: "New processing"
                },
                scriptPanel: {
                    label: {
                        satellites: 'Satellite',
                        preProcScript: 'Pre-processing script',
                        procScript: 'Processing script',
                    }
                },
                filterPanel: {
                    label: {
                        name: 'Name',
                        tags: 'Tags',
                        region: 'Region',
                        initialDate: 'Initial Date',
                        finalDate: 'Final Date',
                        satellite: 'Satellite',
                        processingScript: 'Processing Script',
                        preProcessingScript: 'Pre-processing Script',
                    },
                    button: {
                        filter: 'Filter'
                    },
                },
                table: {
                    titleOngoing: "Ongoing",
                    titleCompleted: "Completed",
                    landsatTile: "Landsat tile",
                    date: "Date",
                    dataset: "Dataset",
                    inputGathering: "Inputdownloading phase",
                    inputPreprocessing: "Preprocessing phase",
                    algorithmExecution: "Processing phase",
                    state: "State",
                    priority: "Priority"
                },
            },
        },
    }, {
        langName: "Portugues (Brasil)",
        langShortName: "Pt-br",
        img: "lang-icon-br.png",
        content: {
            buttons: {
                ok: "Ok",
            },
            messages: {
                sendEmailSuccess: "Enviado com sucesso,<br>verifique sua caixa de email.",
                successNewSubmission: 'Submetido com sucesso.',
                failedNewSubmission: 'Falha ao submeter.',
                unauthorizedNewSubmission: 'Submissão não autorizada.',
                failCoordinatesRequired: "As coordenadas são necessárias",
                failCoordinatesNotNumber: "As coordenadas não são números",
                failInitialDateRequired: "Data inicial é necessária",
                failFinalDateRequired: "Data final é necessária",
                failDateInvalid: "A data final deve ser após a data inicial",
                failPriorityRange: "O valor da prioridade deve ser entre 1 e 100",
                noResultSearch: "Não foram encontrados resultados para esta pesquisa."
            },
            login: {
                placeholdName: "NOME/EMAIL",
                placeholdEmail: "SENHA",
                buttonEnter: "Entrar",
                forgotPassword: "Esqueceu sua senha?",
                createAccount: "Criar nova Conta",
            },
            createAccount: {
                title: "Criar Conta",
                labels: {
                    name: "Nome",
                    email: "E-mail",
                    password: "Senha",
                    confirmPassword: "Confirmar senha",
                },
                buttons: {
                    create: "Criar Conta",
                },
            },
            navbar: {
                menu: {
                    button1: "Processamentos",
                    button2: "Dados",
                    button3: "Ajuda",
                    logout: "Sair",
                    langopt: "Idioma",
                    settings: "Configurações",
                }
            },
            heatMap: {
                label: "Número de imagens processadas",
                infoTo: "a",
            },
            mapFeature: {
                searchBox: {
                    title: "Pesquisar",
                    label: {
                        generalSearch: "Palavras chave ou TAG",
                        detailSearch: "Pesquisa detalhada",
                        region: "Região",
                        firstDate: "Data inicial",
                        lastDate: "Data final",
                        preProcessingScript: "Script de pré-processamento",
                        processingScript: "Script de processamento",
                        satellite: "Satelites",
                    },
                    button: {
                        clear: "Limpar persquisa",
                        search: "Pesquisar",
                    },
                    raioButton: {
                        default: "Pardão",
                        other: "Outro",
                    }
                },
                submissionBox: {
                    title: "Nova Submissão",
                    label: {
                        submissionName: "Nome da Submissão",
                        submissionTags: "Tags",
                        firstDate: "Data inicial",
                        lastDate: "Data final",
                        region: "Região",
                        sapsVersion: "Versão do SAPS",
                        sapsTag: "TAG do SAPS",
                        satellite: "Satelites",
                        requiredField: "Campo Requerido",
                        loadSubmission: "Processando submissão"
                    },
                    button: {
                        submit: "Enviar",
                    },
                    raioButton: {
                        default: "Pardão",
                        other: "Outro",
                    }
                },
                regionDetailBox: {
                    title: "Detalhes da Região",
                    emailInfo: "Click em <b>Enviar email</b> para receber na sua Caixa de Email <br>apenas os links das áreas selecionadas",
                    button: {
                        sendMail: "Enviar Email",
                    },
                    label: {
                        regionName: "Área",
                    },
                },
            },
            infos: {
                regionSearchFilter: {
                    info: "Para acresentar mais de uma região acrescente \";\".",
                    eg: "Ex: região1;região2",
                },
            },
            submissionsList: {
                steps: {
                    title: "Passos ate o download ser completo",
                    downloading: "Baixando",
                    downloaded: "Baixado",
                    queued: "Enfileirado",
                    fetched: "Processado",
                },
                button: {
                    newSubmission: "Nova submissão"
                },
                scriptPanel: {
                    label: {
                        satellites: 'Satelite',
                        preProcScript: 'Script de pré-processamento',
                        procScript: 'Script de processamento',
                    }
                },
                filterPanel: {
                    label: {
                        name: 'Nome',
                        tags: 'Tags',
                        region: 'Região',
                        initialDate: 'Data Inicial',
                        finalDate: 'Data Final',
                        satellite: 'Satelite',
                        processingScript: 'Script de processamento',
                        preProcessingScript: 'Script de pré-processamento',
                    },
                    button: {
                        filter: 'Filtrar'
                    },
                },
                table: {
                    titleOngoing: "Em andamento",
                    titleCompleted: "Concluídos",
                    landsatTile: "Região",
                    date: "Data",
                    dataset: "Dataset",
                    inputGathering: "Fase de download",
                    inputPreprocessing: "Fase de preprocessamento",
                    algorithmExecution: "Fase de processamento",
                    state: "Estado",
                    priority: "Prioridade"
                }
            }
        },
    }]

    var getLangAvailables = function() {
        var langs = [];
        langAvailable.forEach(function(lang, index) {
            langs.push({
                langName: lang.langName,
                langShortName: lang.langShortName,
                img: lang.img
            })
        });
        return langs;
    }
    var getLangByName = function(name) {
        var langFound = undefined;
        langAvailable.forEach(function(lang, index) {
            if (name == lang.langName) {
                langFound = lang;
            }
        });
        return langFound;
    }
    var getLangByShortName = function(shortName) {
        var langFound = undefined;
        langAvailable.forEach(function(lang, index) {
            if (shortName == lang.langShortName) {
                langFound = lang;
            }
        });
        return langFound;
    }

    var getDefault = function() {

        return langAvailable[default_lang];
    }

    var langLoader = {
        getLangAvailables: getLangAvailables,
        getLangByName: getLangByName,
        getLangByShortName: getLangByShortName,
        getDefault: getDefault,
        defaultIndex: default_lang,
    }

    window.langLoader = langLoader;
})();