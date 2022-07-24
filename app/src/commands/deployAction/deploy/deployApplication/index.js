const { makeEventRule } = require('./makeEventRule')

module.exports.deployApplication = async function deployApplication({
    cli,
    aws,
    region,
    appName,
    bucketArn,
    stage,
    config,
    zipConfig,
    printStatus
    // stepFunctionConfig,
    // dashboard
}) {
    const getLambdaPaths = () => {
        const lambaPaths = zipConfig.functionsLocation
        const lambdas = cli.filesystem.getDirectories(lambaPaths)
        const path = zipConfig.zipTarget.split(zipConfig.hiddenFolder + '/')[1]
        return [
            ...lambdas.map((x) => ({
                path: `${path}/${x}.zip`,
                name: x
            }))
        ]
    }

    let template = {
        Resources: {},
        Outputs: {}
    }

    /**
     * Dashboard
     *
     */
    //if (dashboard) {
    //     const cfDashboard = foundation.cloudwatch.cf.makeDashboard({
    //         name: `${appName}${stage}`,
    //         // @ts-ignore
    //         rows: getLambdaPaths().map((l, i) => {
    //             const dConfig =
    //                 config[l.name] && config[l.name].dashboard
    //                     ? config[l.name].dashboard
    //                     : false

    //             if (!dConfig) {
    //                 return {
    //                     type: 'LAMBDAROW',
    //                     verticalPosition: i,
    //                     name: l.name,
    //                     region: region,
    //                     functionName: `${appName}-${l.name}-${stage}`,
    //                     docs: `# ${l.name}`
    //                 }
    //             }

    //             let row = {
    //                 type: 'LAMBDAROW',
    //                 verticalPosition: i,
    //                 name: l.name,
    //                 region: region,
    //                 functionName: `${appName}-${l.name}-${stage}`,
    //                 docs: dConfig.doc || `# ${l.name}`
    //             }

    //             if (dConfig.invocationAlarm) {
    //                 // @ts-ignore
    //                 row.invocationAlarm = dConfig.invocationAlarm
    //             }
    //             if (dConfig.invocationGoal) {
    //                 // @ts-ignore
    //                 row.invocationGoal = dConfig.invocationGoal
    //             }
    //             if (dConfig.errorAlarm) {
    //                 // @ts-ignore
    //                 row.errorAlarm = dConfig.errorAlarm
    //             }
    //             if (dConfig.errorGoal) {
    //                 // @ts-ignore
    //                 row.errorGoal = dConfig.errorGoal
    //             }
    //             if (dConfig.durationAlarm) {
    //                 // @ts-ignore
    //                 row.durationAlarm = dConfig.durationAlarm
    //             }
    //             if (dConfig.durationGoal) {
    //                 // @ts-ignore
    //                 row.durationGoal = dConfig.durationGoal
    //             }

    //             return row
    //         })
    //     })

    //     template.Resources = {
    //         ...template.Resources,
    //         ...cfDashboard.Resources
    //     }
    // }

    /**
     * Alarms
     *
     */
    // getLambdaPaths().map((l, i) => {
    //     const aConfig =
    //         config[l.name] && config[l.name].alarm
    //             ? config[l.name].alarm
    //             : false

    //     if (aConfig) {
    //         const cf = foundation.cloudwatch.cf.makeLambdaErrorAlarm({
    //             appName,
    //             stage,
    //             name: l.name + 'Alarm',
    //             description: aConfig.description || '',
    //             functionName: `${appName}-${l.name}-${stage}`,
    //             threshold: aConfig.threshold,
    //             period: aConfig.period || 300,
    //             evaluationPeriods: aConfig.evaluationPeriods || 3,
    //             snsTopic: aConfig.snsTopic || undefined
    //         })

    //         template.Resources = {
    //             ...template.Resources,
    //             ...cf.Resources
    //         }
    //     }
    // })

    /**
     * Make Lamnda CF
     *
     */
    getLambdaPaths().forEach((x) => {
        const permissions = config[x.name]
            ? config[x.name].permissions.map((x) => ({
                  ...x,
                  Effect: 'Allow'
              }))
            : []

        const res = aws.lambda.makeLambda({
            appName: appName,
            name: x.name,
            stage: stage,
            bucketArn: bucketArn,
            bucketKey: x.path,
            env: config[x.name] ? config[x.name].env : {},
            handler: 'index.handler',
            permissions: permissions,
            timeout:
                config[x.name] && config[x.name].timeout
                    ? config[x.name].timeout
                    : 6,
            layers: config[x.name] ? config[x.name].layers : []
        })

        template.Resources = {
            ...template.Resources,
            ...res.Resources
        }
        template.Outputs = {
            ...template.Outputs,
            ...{
                [`Lambda${x.name}${stage}Arn`]: {
                    Value: {
                        'Fn::GetAtt': [`Lambda${x.name}${stage}`, 'Arn']
                    }
                }
            }
        }

        if (config[x.name].trigger) {
            const cf = makeEventRule({
                appName: appName + stage,
                eventBus: 'default',
                eventSource: config[x.name].trigger.split('_')[0],
                eventName: config[x.name].trigger.split('_')[1],
                lambdaName: `Lambda${x.name}${stage}`
            })
            template.Resources = {
                ...template.Resources,
                ...cf.Resources
            }
        }

        if (config[x.name].url) {
            const functionUrl = {
                Resources: {
                    [`Lambda${x.name}${stage}Url`]: {
                        Type: 'AWS::Lambda::Url',
                        Properties: {
                            AuthType: 'NONE',
                            // Cors: Cors,
                            //InvokeMode: String,
                            // Qualifier: String,
                            TargetFunctionArn: {
                                'Fn::GetAtt': [`Lambda${x.name}${stage}`, 'Arn']
                            }
                        }
                    },
                    [`Lambda${x.name}${stage}InvokeUrlPermission`]: {
                        Type: 'AWS::Lambda::Permission',
                        Properties: {
                            FunctionName: {
                                'Fn::GetAtt': [`Lambda${x.name}${stage}`, 'Arn']
                            },
                            FunctionUrlAuthType: 'NONE',
                            Action: 'lambda:InvokeFunctionUrl',
                            Principal: '*'
                        }
                    }
                },
                Outputs: {
                    [`Lambda${x.name}${stage}Url`]: {
                        Value: {
                            'Fn::GetAtt': [
                                `Lambda${x.name}${stage}Url`,
                                'FunctionUrl'
                            ]
                        }
                    }
                }
            }
            template.Resources = {
                ...template.Resources,
                ...functionUrl.Resources
            }
            template.Outputs = {
                ...template.Outputs,
                ...functionUrl.Outputs
            }
        }
    })

    await aws.cloudformation.deployStack({
        name: appName + stage,
        region,
        template: JSON.stringify(template)
    })

    cli.terminal.clear()
    printStatus('Deploying CloudFormation Template')

    await aws.cloudformation.getDeployStatus({
        region,
        config: {
            stackName: appName + stage,
            minRetryInterval: 5000,
            maxRetryInterval: 10000,
            backoffRate: 1.1,
            maxRetries: 200,
            onCheck: (resources) => {
                cli.terminal.clear()
                let idLength = 0
                resources.forEach((item) => {
                    if (item.id.length > idLength) {
                        idLength = item.id.length
                    }
                })
                resources.forEach((item) => {
                    let str = ''
                    let idCharCount = 0
                    while (idCharCount < idLength) {
                        if (item.id[idCharCount]) {
                            str = str + item.id[idCharCount]
                        } else {
                            str = str + ' '
                        }
                        idCharCount++
                    }

                    str = str + ` \x1b[2m${item.status}\x1b[0m`

                    if (item.status.includes('COMPLETE')) {
                        console.log('\x1b[32m✔ \x1b[37m' + str)
                        // cli.terminal.printSuccessMessage('' + str)
                    } else if (item.status.includes('FAILED')) {
                        cli.terminal.printErrorMessage(str)
                    } else {
                        console.log('\x1b[34m◆ \x1b[37m' + str)
                        // cli.terminal.printInfoMessage(' ' + str)
                    }
                })
                console.log('')
                printStatus('Deploying CloudFormation Template')
            }
        }
    })
}
