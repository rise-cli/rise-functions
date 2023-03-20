import { makeFolders } from './makeFolders.mjs'
import { getAppConfig } from './getAppConfig.mjs'
import { getFunctionConfig } from './getFunctionConfig/index.mjs'

export const getConfig = async (flags) => {
    await makeFolders()

    let appConfig = await getAppConfig()
    appConfig.stage = flags.stage
    if (appConfig.domain) {
        appConfig.domain.stage = flags.stage
    }
    appConfig.region = flags.region

    const { functionConfigs, deployInfra } = await getFunctionConfig(
        appConfig.appName,
        appConfig.region,
        appConfig.stage
    )

    let additionalResources = {
        Resources: {},
        Outputs: {}
    }

    if (appConfig.table) { 
        const t = appConfig.table
        additionalResources.Resources = {
            ...additionalResources.Resources,
            Table: {  
                "Type": "AWS::DynamoDB::Table",
                "Properties": {
                    "TableName": appConfig.appName + 'table',
                    "AttributeDefinitions": [
                        {
                            "AttributeName": t.pk.split(' ')[0],
                            "AttributeType": t.pk.split(' ')[1] === 'string' ? "S" : 'N'
                        },
                        {
                            "AttributeName": t.sk.split(' ')[0],
                            "AttributeType": t.pk.split(' ')[1] === 'string' ? "S" : 'N'
                        }
                    ],
                    "KeySchema": [
                        {
                            "AttributeName": t.pk.split(' ')[0],
                            "KeyType": "HASH"
                        },
                        {
                            "AttributeName": t.sk.split(' ')[0],
                            "KeyType": "RANGE"
                        }
                    ],
                    "BillingMode": "PAY_PER_REQUEST"
                }
            }
        }

        const permission = {
            Effect: 'Allow',
            Action: [
                'dynamodb:Query',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem'
            ],
            Resource: {
                "Fn::GetAtt": [
                    "Table",
                    'Arn'
                ]
            }
        }

        Object.keys(functionConfigs).forEach((k) => { 
            functionConfigs[k].permissions = [
                ...functionConfigs[k].permissions,
                permission
            ]
        })
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
