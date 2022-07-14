module.exports.updateLambdaCode = async function updateLambdaCode({
    cli,
    aws,
    appName,
    stage,
    bucket
}) {
    const getAllPaths = () => {
        const lambaPaths = '/functions'
        const lambdas = cli.filesystem.getDirectories(lambaPaths)

        return [
            ...lambdas.map((x) => ({
                path: `lambdas/${x}.zip`,
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
            bucket: bucket
        })
    }
}
