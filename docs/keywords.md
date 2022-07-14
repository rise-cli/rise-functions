# Keywords

Keywords are a way to reference dynamic values in your rise.js file or functionconfig, you can reference:

-   Stage
-   Region
-   AccountId
-   CloudFormation Outputs
-   SSM Parameter Store

All keywords use the following format: `{@keyword}`.

## Stage

It is common to deploy to many stages, and there may be times we want to reference a value or resource based on the stage we are in. We can do this by using the stage keyword:

```js
const stage = `{@stage}`
```

An example of when we might use stage is to pass this as an env variable into our Lambda function:

```js
// index.js
module.exports.config = {
    env: {
        STAGE: '{@stage}',
        SOME_ENDPOINT: 'https://myendpoint-{@stage}.com'
    }
}
```

## Region

You can reference the region as follows:

```js
const region = `{@region}`
```

An example of when we might use region is to build up an arn value:

```js
// index.js
module.exports.config = {
    env: {
        TOPIC: 'arn:aws:sns:{@region}:12341234:ChatOpsTopic'
    }
}
```

## AccountId

You can reference your account id as follows:

```js
const accountId = `{@accountId}`
```

An example of when we might use accountId is to build up an arn value:

```js
// index.js
module.exports.config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource: 'arn:aws:dynamodb:us-east-1:{@accountId}:table/myTable'
        }
    ]
}
```

## CloudFormation Outputs

Every deployed CloudFormation template has the option of defining outputs. This is great for dynamically referring to resource names or resource arns. Example, if we have deployed the following template:

```yml
Resources:
    Notes:
        Type: 'AWS::DynamoDB::Table'
        Properties:
            #...bunch of properties
Outputs:
    NotesArn:
        Value:
            'Fn::GetAtt':
                - Notes
                - Arn
```

The ARN of the table is made available for us to reference by refering to the NotesArn output. You can reference this value with the following keyword:

```js
const arn = `{@output.stackName.NotesArn}`
```

A common scenario for using outputs would be to define iam permissions for a lambda function, Example:

```js
// index.js
module.exports.config = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'dynamodb:Query',
            Resource: '{@output.stackName.NotesArn}'
        }
    ]
}
```

## SSM Parameter Store

SSM Parameter Store is an AWS service for storing parameters in your account.
This can be likened to other services like Github or Vercel which allow you to set
env variables to reference in your deployment pipeline. It is important to note that
you should not use parameter store if the value is a secret. Consider using AWS Secret Manager
for senstive secrets and keys, and parameter store for values you are fine being visible as plain text
in code or in Lambda config.

You can reference a parameter as follows:

```js
const endpoint = `{@ssm.external_service_endpoint}`
```

An example of when we might use ssm is to pass this as an env variable into our Lambda function:

```js
// index.js
module.exports.config = {
    env: {
        EXTERNAL_SERVICE_ENDPOINT: '{@ssm.my_external_service_endpoint}'
    }
}
```
