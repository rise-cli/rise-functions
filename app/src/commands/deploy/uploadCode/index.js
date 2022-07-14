const HIDDEN_FOLDER = '.rise'

module.exports.uploadLambdas = async function uploadLambdas(
    cli,
    aws,
    bucketName,
    path
) {
    const pathDir = path || ''

    const getAllPaths = () => {
        const lambaPaths = pathDir + '/functions'
        const lambdas = cli.filesystem.getDirectories(lambaPaths)
        return lambdas.map(
            (name) => `${pathDir}/${HIDDEN_FOLDER}/lambdas/${name}.zip`
        )
    }

    let result = []
    const paths = getAllPaths()
    for (const path of paths) {
        const file = await cli.filesystem.getFile(path)
        const res = await aws.s3.uploadFile({
            file,
            bucket: bucketName,
            key: path.split(HIDDEN_FOLDER + '/')[1]
        })
        result.push(res)
    }

    return result
}
