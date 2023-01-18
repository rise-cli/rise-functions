#! /usr/bin/env node
import * as cli from 'rise-cli-foundation'
import { deploy } from './commands/deploy/index.js'
import { remove } from './commands/remove/index.js'
import { generate } from './commands/generate/index.js'

cli.addCommand({
    command: 'deploy',
    description: 'Deploy functions',
    flags: [
        {
            flag: '--stage',
            default: 'dev'
        },
        {
            flag: '--region',
            default: 'us-east-1'
        },
        {
            flag: '--ci',
            default: 'false'
        }
    ],
    action: async (flags) => {
        await deploy(flags)
    }
})

cli.addCommand({
    command: 'generate',
    description: 'Generate a project',
    flags: [
        {
            flag: '--type',
            default: 'simple'
        }
    ],
    action: async (flags) => {
        await generate(flags)
    }
})

cli.addCommand({
    command: 'remove',
    description: 'Remove functions',
    flags: [
        {
            flag: '--stage',
            default: 'dev'
        },
        {
            flag: '--region',
            default: 'us-east-1'
        }
    ],
    action: async (flags) => {
        await remove(flags)
    }
})

cli.runProgram()
