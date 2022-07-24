module.exports.updateLambdaCode = async function updateLambdaCode({
    cli,
    aws,
    appName,
    stage,
    region,
    bucket,
    zipConfig
}) {
    const getAllPaths = () => {
        const lambaPaths = zipConfig.functionsLocation
        const lambdas = cli.filesystem.getDirectories(lambaPaths)
        const path = zipConfig.zipTarget.split(zipConfig.hiddenFolder + '/')[1]
        return [
            ...lambdas.map((x) => ({
                path: `${path}/${x}.zip`,
                name: x
            }))
        ]
    }

    const getFunctionName = (name) => `${appName}-${name}-${stage}`
    for (const l of getAllPaths()) {
        const lambdaName = getFunctionName(l.name)

        await aws.lambda.updateLambdaCode({
            name: lambdaName,
            filePath: l.path,
            bucket: bucket,
            region
        })
    }
}
