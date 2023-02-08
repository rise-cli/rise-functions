import * as aws from 'rise-aws-foundation'

export async function addKeywordsToPermissions(config, keywords) {
    try {
        let permissions = []
        for (const k of config.permissions) {
            if (Array.isArray(k.Resource)) {
                const resource = []
                for (const r of k.Resource) {
                    const res = await aws.account.getKeyword(keywords, r)
                    keywords = res.state
                    resource.push(res.result)
                }
                permissions.push({
                    Effect: k.Effect,
                    Action: k.Action,
                    Resource: resource
                })
            } else {
                const res = await aws.account.getKeyword(keywords, k.Resource)
                keywords = res.state
                permissions.push({
                    Effect: k.Effect,
                    Action: k.Action,
                    Resource: res.result
                })
            }
        }
        config.permissions = permissions
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message)
        }
    }

    return {
        config,
        keywords
    }
}
