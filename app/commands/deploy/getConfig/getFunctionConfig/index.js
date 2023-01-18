import * as filesystem from 'rise-filesystem-foundation'
import { validateFunctionConfig } from './validation/index.js'
import { applyKeywords } from './keywords/index.js'
import fs from 'fs'
import crypto from 'crypto'
import { code } from './code.js'

function getFunctionDirectories() {
    try {
        return filesystem.getDirectories({
            path: '/functions',
            projectRoot: process.cwd()
        })
    } catch (e) {
        if (e.message.includes('no such file or directory')) {
            return []
        }

        throw new Error(e)
    }
}

async function getFunctionConfigFile(configPath) {
    try {
        let file = await filesystem.getJsFile({
            projectRoot: process.cwd(),
            path: configPath
        })

        return file.config
    } catch (e) {
        throw new Error('Every function folder must have a config.mjs file ')
    }
}

export async function getFunctionConfig(region, stage) {
    const keywords = {
        '@region': region,
        '@stage': stage
    }

    const dirPath = '/functions'
    let configObj = {}
    let dir = getFunctionDirectories()

    let configStr = ''
    for (const x of dir) {
        // const configPath = `${dirPath}/${x}/config.mjs`
        const configPath = `${dirPath}/${x}/index.mjs`
        const config = await getFunctionConfigFile(configPath)
        configStr = configStr + JSON.stringify(config)
        const validatedConfig = validateFunctionConfig(config, x)
        const keywordedConfig = await applyKeywords(validatedConfig, keywords)

        // Copy Dir
        filesystem.copyDir({
            source: `${dirPath}/${x}/`,
            target: `/.rise/src/lambdas/${x}`,
            projectRoot: process.cwd()
        })

        // rename index.js to _index.js
        filesystem.copyFile({
            source: `/.rise/src/lambdas/${x}/index.mjs`,
            target: `/.rise/src/lambdas/${x}/_index.mjs`,
            projectRoot: process.cwd()
        })

        // write index.js file
        filesystem.writeFile({
            path: `/.rise/src/lambdas/${x}/index.mjs`,
            content: code,
            projectRoot: process.cwd()
        })

        configObj[x] = keywordedConfig
    }

    let files = fs.readdirSync(process.cwd() + '/functions')
    console.log('THE FILES:', files)

    let singleFileLambas = files
        .filter((x) => x.endsWith('.mjs'))
        .map((x) => x.split('.')[0])

    for (const x of singleFileLambas) {
        // const configPath = `${dirPath}/${x}/config.mjs`
        const configPath = `${dirPath}/${x}.mjs`
        const config = await getFunctionConfigFile(configPath)
        configStr = configStr + JSON.stringify(config)
        const validatedConfig = validateFunctionConfig(config, x)
        const keywordedConfig = await applyKeywords(validatedConfig, keywords)

        await filesystem.makeDir({
            path: `/.rise/src/lambdas/${x}`,
            projectRoot: process.cwd()
        })

        // rename index.js to _index.js
        filesystem.copyFile({
            source: `${dirPath}/${x}.mjs`,
            target: `/.rise/src/lambdas/${x}/_index.mjs`,
            projectRoot: process.cwd()
        })

        // write index.js file
        filesystem.writeFile({
            path: `/.rise/src/lambdas/${x}/index.mjs`,
            content: code,
            projectRoot: process.cwd()
        })

        configObj[x] = keywordedConfig
    }
    /**
     * Determine if we deploy infra or not
     */
    const hash = crypto
        .createHash('sha256')
        .update(configStr, 'utf8')
        .digest('hex')

    let deployInfra = true
    try {
        let file = await filesystem.getJsFile({
            projectRoot: process.cwd(),
            path: '/.rise/infra.mjs'
        })
        console.log('THE PREV HASH: ', file.hash)
        if (file.hash === hash) {
            deployInfra = false
        }
        filesystem.writeFile({
            path: `/.rise/infra.mjs`,
            content: `export const hash = '${hash}'`,
            projectRoot: process.cwd()
        })
    } catch (e) {
        // dont have one yet
        filesystem.writeFile({
            path: `/.rise/infra.mjs`,
            content: `export const hash = '${hash}'`,
            projectRoot: process.cwd()
        })
        deployInfra = true
    }

    return {
        functionConfigs: configObj,
        deployInfra
    }
}
