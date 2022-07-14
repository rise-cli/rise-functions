async function parseConfig(cli, aws, originalState, dirPath) {
    let state = originalState
    let configObj = {}
    let dir = []

    try {
        dir = cli.filesystem.getDirectories(dirPath)
    } catch (e) {
        if (e.message.includes('no such file or directory')) {
            return {
                state,
                config: configObj
            }
        }

        throw new Error(e)
    }

    for (const x of dir) {
        const path = `${dirPath}/${x}/index.js`

        let file = require(process.cwd() + path)
        const config = file.config

        // let file = require(process.cwd() + `${dirPath}/${x}`)
        // const config = file.config

        /**
         * Handle alarm config
         */
        if (config.alarm && config.alarm.snsTopic) {
            const res = await aws.keywords.getKeyword(
                state,
                config.alarm.snsTopic
            )
            state = res.state
            config.alarm.snsTopic = res.result
        }

        /**
         * Handle trigger config
         */
        if (config.trigger) {
            const res = await aws.keywords.getKeyword(state, config.trigger)
            state = res.state
            config.trigger = res.result
        }

        /**
         * Handle env config
         */
        if (config.env) {
            for (const k of Object.keys(config.env)) {
                const res = await aws.keywords.getKeyword(state, config.env[k])

                state = res.state
                config.env[k] = res.result
            }
        }

        /**
         * Handle permission config
         */
        if (config.permissions) {
            let permissions = []
            for (const k of config.permissions) {
                const res = await aws.keywords.getKeyword(state, k.Resource)
                state = res.state
                permissions.push({
                    Effect: k.Effect,
                    Action: k.Action,
                    Resource: res.result
                })
            }
            config.permissions = permissions
        }

        configObj[x] = config
    }

    return {
        state,
        config: configObj
    }
}

module.exports.getFunctionConfig = async function getFunctionConfig(
    cli,
    aws,
    region,
    stage,
    path
) {
    const state = {
        '@region': region,
        '@stage': stage
    }

    const lambdaResult = await parseConfig(cli, aws, state, '/functions')
    return {
        lambdaConfig: lambdaResult.config
    }
}
