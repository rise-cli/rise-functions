//const { getConfig } = require('../deploy/getConfig')
//const { deployApplicationBucket } = require('../deploy/deployApplicationBucket')
//const { emptyBucket } = require('../deploy/utils/bucket')

async function main(cli, aws) {
    // /**
    //  * Get project  info locally
    //  */
    // const stage = 'dev'
    // const region = 'us-east-1'
    // const config = await getConfig(cli, aws)
    // /**
    //  * Get Projject info remotely if local isnt available
    //  */
    // const deployName = config.title.replace(/\s/g, '') + 'functions'
    // if (!config.bucketName) {
    //     const bucketName = await deployApplicationBucket(
    //         cli,
    //         aws,
    //         deployName,
    //         stage
    //     )
    //     config.bucketName = bucketName
    // }
    // const stackName = deployName + stage + '-bucket'
    // /**
    //  * Empty bucket
    //  */
    // await emptyBucket({
    //     bucketName: config.bucketName
    // })
    // /**
    //  * Remove stack
    //  */
    // await aws.cloudformation.removeStack({
    //     name: stackName,
    //     template: ''
    // })
    // await cli.filesystem.removeDir('/.risefunctions')
    // cli.terminal.clear()
    // cli.terminal.printSuccessMessage('Project Successfully Removed')
}

module.exports = main
