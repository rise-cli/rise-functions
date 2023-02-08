import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'

/**
 * Config
 */
export const config = {
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
        bus: '{@outputs.stackName.EventBusName}',
        source: 'EVENT_SOURCE',
        name: 'EVENT_NAME'
    }
}

/**
 * Handler
 */
const eventbridge = new AWS.EventBridge({
    region: process.env.AWS_REGION
})

const emit = async ({ source, name, input }) => {
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

export const handler = async () => {
    await emit({
        source: 'THIS_SERVICE',
        name: 'EVENT_NAME',
        input: {
            id: 100
        }
    })
}
