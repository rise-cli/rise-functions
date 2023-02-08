import { getConfig } from '../deploy/getConfig/index.mjs'
import * as cli from 'rise-cli-foundation'
import { removeBackend } from './removeAction/index.mjs'

export async function remove(flags) {
    try {
        let config = await getConfig(flags)
        await removeBackend(config)
    } catch (e) {
        if (e instanceof Error) {
            cli.clear()
            cli.printErrorMessage('Rise Functions Validation Error')
            cli.printInfoMessage(e.message)
        }
    }
}
