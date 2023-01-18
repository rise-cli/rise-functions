import { getConfig } from './getConfig/index.js'
import { deployBackend } from 'rise-deploybackend'
import * as cli from 'rise-cli-foundation'

export async function deploy(flags) {
    try {
        let config = await getConfig(flags)

        if (flags.ci === 'true') {
            config.deployInfra = true
        }

        await deployBackend(config)
    } catch (e) {
        if (e instanceof Error) {
            cli.clear()
            cli.printErrorMessage('Rise Functions Error')
            cli.printInfoMessage(e.message)
        } else {
            throw new Error('Unknown Error')
        }
    }
}
