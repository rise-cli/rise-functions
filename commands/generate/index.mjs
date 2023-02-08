import * as cli from 'rise-cli-foundation'
import * as filesystem from 'rise-filesystem-foundation'
import process from 'node:process'

const types = {
    customMetrics: true,
    db: true,
    events: true,
    simple: true
}

export async function generate(flags) {
    if (!types[flags.type]) {
        cli.clear()
        cli.printErrorMessage('Rise Functions Validation Error')
        cli.printInfoMessage(`${flags.type} is not a valid option`)
        return
    }
    /**
     * Helper Functions
     */
    const createDir = async (path) => {
        await filesystem.makeDir({
            path,
            projectRoot: process.cwd()
        })
    }

    await createDir('/functions')

    /**
     * DB EXAMPLE
     *
     */
    if (flags.type === 'db') {
        await createDir('/functions/dbExample')

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/dbExample/config.mjs',
            content: `export const config = {
    url: 'GET /list',
    env: {
        TABLE: '{@output.stackName.TableName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: [
                'dynamodb:Query',
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:DeleteItem'
            ],
            Resource: '{@output.stackName.TableArn}'
        }
    ]
}
`
        })
        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/dbExample/index.mjs',
            content: `import { list } from './db.mjs'

export const handler = async (event) => {
    const result = await list({
        pk: 'admin',
        sk: 'note'
    })

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(result)
    }
}
`
        })

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/dbExample/db.mjs',
            content: `import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})

export const list = async ({ pk, sk, cursor = null }) => {
    const params = {
        TableName: table,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': pk,
            ':sk': sk
        },
        Limit: 10
    }

    if (cursor) {
        params.ExclusiveStartKey = {
            pk: pk,
            sk: cursor
        }
    }

    const result = await dynamoDb.query(params).promise()
    return {
        items: result.Items,
        next: result.LastEvaluatedKey ? result.LastEvaluatedKey.sk : false
    }
}

export const get = async ({ pk, sk }) => {
    const params = {
        TableName: table,
        Key: {
            pk: pk,
            sk: sk
        }
    }

    const result = await dynamoDb.get(params).promise()
    return result.Item
}

export const set = async (data) => {
    const params = {
        TableName: table,
        Item: data
    }

    return await dynamoDb.put(params).promise()
}

export const remove = async ({ pk, sk }) => {
    const params = {
        TableName: table,
        Key: {
            pk: pk,
            sk: sk
        }
    }

    return await dynamoDb.delete(params).promise()
}
`
        })
    }

    /**
     * EVENT EXAMPLE
     *
     */
    if (flags.type === 'events') {
        await createDir('/functions/eventExample')

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/eventExample/config.mjs',
            content: `export const config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Resource: '{@outputs.stackName.EventBusArn}'
        }
    ],
    env: {
        STAGE: '{@stage}',
        BUS: '{@outputs.stackName.EventBusName}'
    },
    eventRule: {
        bus:  '{@outputs.stackName.EventBusName}',
        source: 'EVENT_SOURCE',
        name: 'EVENT_NAME'
    }
}`
        })

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/eventExample/index.mjs',
            content: `import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const eventbridge = new AWS.EventBridge({
    region: process.env.AWS_REGION
})

const emit = async ({source, name, input}) => {
    const params = {
        Entries: [
            {
                Detail: JSON.stringify(input),
                DetailType: name,
                EventBusName: process.env.BUS,
                Source: source,
                Time: new Date()
            }
        ]
    }

    await eventbridge.putEvents(params).promise()
}
            
export const handler = async (event) => {
    await emit({
        source: 'THIS_SERVICE',
        name: 'EVENT_NAME',
        input: {
            id: 100
        } 
    })
}`
        })
    }

    /**
     * CUSTOM METRIC EXAMPLE
     *
     */
    if (flags.type === 'customMetrics') {
        await createDir('/functions/customMetricExample')

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/customMetricExample/config.mjs',
            content: `export const config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'cloudwatch:PutMetricData',
            Resource: '*'
        }
    ],
    eventRule: {
        bus:  '{@outputs.stackName.EventBusName}',
        source: 'EVENT_SOURCE',
        name: 'EVENT_NAME'
    }
}`
        })

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/customMetricExample/index.mjs',
            content: `import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const cloudwatch = new AWS.CloudWatch({
    region: process.env.AWS_REGION
})

async function writeWaitTimeMetric({ nameSpace, metricName, unit, value, dimensions }) {
    const params = {
        MetricData: [
            {
                MetricName: metricName,
                Dimensions: dimensions.map(x => ({
                    Name: x.name,
                    Value: x.value
                })),
                Unit: unit,
                Value: value
            }
        ],
        Namespace: nameSpace
    }
    await cloudwatch.putMetricData(params).promise()
}
    
export const handler = async (event) => {
    await writeWaitTimeMetric({
        nameSpace: 'CustomerExperience',
        metricName: 'OrderWaitTime',
        unit: 'Milliseconds',
        value: event.value,
        dimensions: [
            {
                name: 'Store',
                value: event.storeId
            }
        ]
    })
}`
        })
    }
    /**
     * SIMPLE EXAMPLE
     *
     */
    if (flags.type === 'simple') {
        await createDir('/functions')

        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/functions/simple.mjs',
            content: `export const config = {
    url: 'GET /example'
}

export const handler = async () => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: 'Hello from Rise Functions'
        })
    }
}`
        })
    }

    try {
        const x = require(process.cwd() + '/rise.mjs')
    } catch (e) {
        filesystem.writeFile({
            projectRoot: process.cwd(),
            path: '/rise.mjs',
            content: `export default {
    type: 'functions',
    name: 'nameOfMyProject'
}`
        })
    }

    cli.clear()
    console.log('✅ Generated Successfully')
}
