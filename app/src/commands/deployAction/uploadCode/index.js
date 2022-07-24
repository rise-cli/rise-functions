module.exports.uploadLambdas = async function uploadLambdas(
    cli,
    aws,
    bucketName,
    config
) {
    const getAllPaths = () => {
        const lambaPaths = config.functionsLocation
        const lambdas = cli.filesystem.getDirectories(lambaPaths)
        return lambdas.map((name) => `${config.zipTarget}/${name}.zip`)
    }

    let result = []
    const paths = getAllPaths()
    for (const path of paths) {
        const file = await cli.filesystem.getFile(path)
        const res = await aws.s3.uploadFile({
            file,
            bucket: bucketName,
            key: path.split(config.hiddenFolder + '/')[1]
        })
        result.push(res)
    }

    return result
}
