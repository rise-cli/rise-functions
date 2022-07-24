function getLambdaFunctionPaths(cli, folderName) {
    let lambdas = []
    try {
        lambdas = cli.filesystem.getDirectories(folderName)
    } catch (e) {
        lambdas = []
    }

    return lambdas.map((name) => {
        return {
            path: folderName + '/' + name,
            name
        }
    })
}

module.exports.zipLambdas = async function zipLambdas(cli, config) {
    const lambdas = getLambdaFunctionPaths(cli, config.functionsLocation)
    for (const lambda of lambdas) {
        await cli.filesystem.zipFolder({
            source: lambda.path,
            target: config.zipTarget,
            name: lambda.name
        })
    }
}
