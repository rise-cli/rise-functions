import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'

/**
 * Config
 */
export const config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'cloudwatch:PutMetricData',
            Resource: '*'
        }
    ],
    eventRule: {
        bus: '{@outputs.stackName.EventBusName}',
        source: 'EVENT_SOURCE',
        name: 'EVENT_NAME'
    }
}

/**
 * Handler
 */
const cloudwatch = new AWS.CloudWatch({
    region: process.env.AWS_REGION
})

async function writeWaitTimeMetric({
    nameSpace,
    metricName,
    unit,
    value,
    dimensions
}) {
    const params = {
        MetricData: [
            {
                MetricName: metricName,
                Dimensions: dimensions.map((x) => ({
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
}
