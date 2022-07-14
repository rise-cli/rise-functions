const { makeEventRule } = require('./makeEventRule')

module.exports.deployApplication = async function deployApplication({
    cli,
    aws,
    region,
    appName,
    bucketArn,
    stage,
    config,
    stepFunctionConfig,
    dashboard
}) {
    const getLambdaPaths = () => {
        const lambaPaths = '/functions'
        const lambdas = cli.filesystem.getDirectories(lambaPaths)

        return [
            ...lambdas.map((x) => ({
                path: `lambdas/${x}.zip`,
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
    })

    await aws.cloudformation.deployStack({
        name: appName + stage,
        template: JSON.stringify(template)
    })

    cli.terminal.clear()
    cli.terminal.printInfoMessage('Deploying functions to AWS Lambda...')

    await aws.cloudformation.getDeployStatus({
        config: {
            stackName: appName + stage,
            minRetryInterval: 5000,
            maxRetryInterval: 10000,
            backoffRate: 1.1,
            maxRetries: 200,
            onCheck: (resources) => {
                cli.terminal.clear()
                resources.forEach((item) => {
                    cli.terminal.printInfoMessage(`${item.id}: ${item.status}`)
                })
            }
        }
    })
}
