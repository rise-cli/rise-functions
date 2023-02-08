import { makeFolders } from './makeFolders.mjs'
import { getAppConfig } from './getAppConfig.mjs'
import { getFunctionConfig } from './getFunctionConfig/index.mjs'

export const getConfig = async (flags) => {
    await makeFolders()

    let appConfig = await getAppConfig()
    appConfig.stage = flags.stage
    appConfig.region = flags.region

    const { functionConfigs, deployInfra } = await getFunctionConfig(
        appConfig.region,
        appConfig.stage
    )

    let additionalResources = {
        Resources: {},
        Outputs: {}
    }

    Object.keys(functionConfigs).forEach((k) => {
        if (typeof functionConfigs[k].schedule === 'number') {
            additionalResources.Resources = {
                ...additionalResources.Resources,
                [`ScheduledRule${k}${appConfig.stage}`]: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        Description: 'ScheduledRule',
                        ScheduleExpression: `rate(${functionConfigs[k].schedule} minutes)`,
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {
                                    'Fn::GetAtt': [
                                        `Lambda${k}${appConfig.stage}`,
                                        'Arn'
                                    ]
                                },
                                Id: 'TargetFunction' + `${k}${appConfig.stage}`
                            }
                        ]
                    }
                },
                [`ScheduleRulePermission${k}${appConfig.stage}`]: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        FunctionName: { Ref: `Lambda${k}${appConfig.stage}` },
                        Action: 'lambda:InvokeFunction',
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': [
                                `ScheduledRule${k}${appConfig.stage}`,
                                'Arn'
                            ]
                        }
                    }
                }
            }
        }
    })
    return {
        app: appConfig,
        functions: functionConfigs,
        deployName: appConfig.appName.replace(/\s/g, '') + 'functions',
        zipConfig: {
            functionsLocation: '/.rise/src/lambdas',
            zipTarget: '/.rise/lambdas',
            hiddenFolder: '.rise'
        },
        deployInfra: deployInfra,
        additionalResources
    }
}
