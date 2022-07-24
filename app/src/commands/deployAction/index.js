const { zipLambdas } = require('./zipFiles')
const { deployApplicationBucket } = require('./deploy/deployApplicationBucket')
const { deployApplication } = require('./deploy/deployApplication')
const { uploadLambdas } = require('./uploadCode')
const { updateLambdaCode } = require('./updateCode')

let loadingInterval
const printLoadingMessage = (msg) => {
    const process = require('process')
    const std = process.stdout
    const eighties = [
        '▰▱▱▱▱▱▱',
        '▰▰▱▱▱▱▱',
        '▰▰▰▱▱▱▱',
        '▰▰▰▰▱▱▱',
        '▰▰▰▰▰▱▱',
        '▰▰▰▰▰▰▱',
        '▰▰▰▰▰▰▰',
        '▱▰▰▰▰▰▰',
        '▱▱▰▰▰▰▰',
        '▱▱▱▰▰▰▰',
        '▱▱▱▱▰▰▰',
        '▱▱▱▱▱▰▰',
        '▱▱▱▱▱▱▰'
    ]

    const dots = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

    const spinnerFrames = dots
    let index = 0

    const log = () => {
        process.stdout.write('\x1B[?25l')
        let line = spinnerFrames[index]

        if (!line) {
            index = 0
            line = spinnerFrames[index]
        }

        // rdl.cursorTo(std, 0, 0)
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        std.write('\x1b[31m' + line + '\x1b[37m' + ' ' + msg)

        index = index >= spinnerFrames.length ? 0 : index + 1
    }

    clearInterval(loadingInterval)
    log()
    loadingInterval = setInterval(log, 100)
}

module.exports.deploy = async (cli, aws, config) => {
    try {
        cli.terminal.clear()
        printLoadingMessage('Zipping up code')

        await zipLambdas(cli, config.zipConfig)

        const deployName = config.deployName
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
        printLoadingMessage('Uploading code to AWS S3')
        await uploadLambdas(cli, aws, config.bucketName, config.zipConfig)

        await deployApplication({
            cli,
            aws,
            region: config.region,
            appName: config.name,
            bucketArn: 'arn:aws:s3:::' + config.bucketName,
            stage: config.stage,
            config: config.lambda,
            zipConfig: config.zipConfig,
            printStatus: (x) => printLoadingMessage(x)
            // stepFunctionConfig: config.stepFunction,
            // dashboard: config.dashboard
        })

        await updateLambdaCode({
            cli,
            aws,
            appName: config.name,
            bucket: config.bucketName,
            stage: config.stage,
            zipConfig: config.zipConfig,
            region: config.region
        })

        const lambdaUrlOutputs = Object.keys(config.lambda).map((x) => {
            return `Lambda${x}${config.stage}Url`
        })
        const outputs = await aws.cloudformation.getOutputs({
            stack: config.name + config.stage,
            region: config.region,
            outputs: lambdaUrlOutputs
        })

        clearInterval(loadingInterval)
        cli.terminal.clear()
        cli.terminal.printSuccessMessage('Deployment Complete')

        Object.keys(config.lambda).forEach((k) => {
            cli.terminal.printInfoMessage(
                `${k} : ${outputs[`Lambda${k}${config.stage}Url`]}`
            )
        })
    } catch (e) {
        clearInterval(loadingInterval)

        cli.terminal.clear()
        cli.terminal.printErrorMessage('Rise Functions Error')
        cli.terminal.printInfoMessage(e.message)
    }
}
