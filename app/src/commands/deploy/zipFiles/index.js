const HIDDEN_FOLDER = '.risefunctions'

function getLambdaFunctionPaths(cli, path, folderName) {
    let lambdas = []
    const functionsPath = path + '/' + folderName
    try {
        lambdas = cli.filesystem.getDirectories(functionsPath)
    } catch (e) {
        lambdas = []
    }

    return lambdas.map((name) => {
        return {
            path: functionsPath + '/' + name,
            name
        }
    })
}

module.exports.zipLambdas = async function zipLambdas(cli, path) {
    const dirPath = path || ''
    const lambdas = getLambdaFunctionPaths(cli, dirPath, 'functions')
    for (const lambda of lambdas) {
        await cli.filesystem.zipFolder({
            source: lambda.path,
            target: dirPath + '/' + HIDDEN_FOLDER + '/lambdas',
            name: lambda.name
        })
    }
}
