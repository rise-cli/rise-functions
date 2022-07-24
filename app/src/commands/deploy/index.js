const { getConfig } = require('./getConfig')
const { deploy } = require('../deployAction')

module.exports.deploy = async (cli, aws, flags) => {
    let config
    try {
        config = await getConfig(cli, aws)
    } catch (e) {
        cli.terminal.clear()
        cli.terminal.printErrorMessage('Rise Functions Validation Error')
        cli.terminal.printInfoMessage(e.message)
    }

    const realConfig = {
        name: config.name,
        bucketName: config.bucketName,
        stage: flags.stage,
        region: flags.region,
        lambda: config.lambda,
        deployName: config.name.replace(/\s/g, '') + 'functions',
        zipConfig: {
            functionsLocation: '/functions',
            zipTarget: '/.rise/lambdas',
            hiddenFolder: '.rise'
        }
    }

    await deploy(cli, aws, realConfig)
}
