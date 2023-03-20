import { getConfig } from './getConfig/index.mjs'
import { deployBackend } from './deployApp/index.mjs'
import * as cli from 'rise-cli-foundation'

export async function deploy(flags) {
    try {
        let config = await getConfig(flags)

        if (flags.ci === 'true') {
            config.deployInfra = true
        }

        //throw new Error(JSON.stringify(config, null, 2))
        await deployBackend(config)
    } catch (e) {
        if (e instanceof Error) {
            console.log(e)
            // cli.clear()
            // cli.printErrorMessage('Rise Functions Error')
            // cli.printInfoMessage(e.message)
        } else {
            throw new Error('Unknown Error')
        }
    }
}
