const HIDDEN_FOLDER = '.risefunctions'

module.exports.makeFolders = async function makeFocusFolder(cli, path) {
    /**
     * Create focus folder
     */
    const projectFolder = cli.filesystem.getDirectories('/')
    if (!projectFolder.includes(HIDDEN_FOLDER)) {
        await cli.filesystem.makeDir('/' + HIDDEN_FOLDER)
    }

    /**
     * Create lambda folder
     */
    const focusFolder = cli.filesystem.getDirectories('/' + HIDDEN_FOLDER)
    if (!focusFolder.includes('lambdas')) {
        await cli.filesystem.makeDir('/' + HIDDEN_FOLDER + '/lambdas')
    }

    /**
     * Create src folder
     */
    if (!focusFolder.includes('src')) {
        await cli.filesystem.makeDir('/' + HIDDEN_FOLDER + '/src')
        await cli.filesystem.makeDir('/' + HIDDEN_FOLDER + '/src/lambdas')
    }
}
