const { getConfig } = require('./getConfig')
const { zipLambdas } = require('./zipFiles')
const { deployApplicationBucket } = require('./deploy/deployApplicationBucket')
const { deployApplication } = require('./deploy/deployApplication')
const { uploadLambdas } = require('./uploadCode')
const { updateLambdaCode } = require('./updateCode')

module.exports.deploy = async (cli, aws) => {
    try {
        cli.terminal.clear()
        cli.terminal.printInfoMessage('Zipping up code...')
        const config = await getConfig(cli, aws)

        await zipLambdas(cli)

        const deployName = config.name.replace(/\s/g, '') + 'functions'
        if (!config.bucketName) {
            const bucketName = await deployApplicationBucket(
                cli,
                aws,
                deployName,
                config.stage
            )
            config.bucketName = bucketName
        }

        cli.terminal.clear()
        cli.terminal.printInfoMessage('Uploading code to AWS S3...')
        await uploadLambdas(cli, aws, config.bucketName)

        await deployApplication({
            cli,
            aws,
            region: config.region,
            appName: config.name,
            bucketArn: 'arn:aws:s3:::' + config.bucketName,
            stage: config.stage,
            config: config.lambda,
            stepFunctionConfig: config.stepFunction,
            dashboard: config.dashboard
        })

        await updateLambdaCode({
            cli,
            aws,
            appName: config.name,
            bucket: config.bucketName,
            stage: config.stage
        })

        const lambdaUrlOutputs = Object.keys(config.lambda).map((x) => {
            return `Lambda${x}${config.stage}Url`
        })
        const outputs = await aws.cloudformation.getOutputs({
            stack: config.name + config.stage,
            outputs: lambdaUrlOutputs
        })

        cli.terminal.clear()
        cli.terminal.printSuccessMessage('Deployment Complete')

        Object.keys(config.lambda).forEach((k) => {
            cli.terminal.printInfoMessage(
                `${k} : ${outputs[`Lambda${k}${config.stage}Url`]}`
            )
        })
    } catch (e) {
        cli.terminal.clear()
        cli.terminal.printErrorMessage('Rise Functions Error')
        cli.terminal.printInfoMessage(e.message)
    }
}
