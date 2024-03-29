# Rise Functions

[Github](https://github.com/rise-cli/rise-functions)

Rise Functions is a CLI which takes a `rise.mjs` file, and deploys AWS Lambda functions into your AWS account. All lambda functions are located in a /functions folder. The goal of rise functions is to make building AWS Lambda functions as simple and straight forward as possible.

## Why use this over other frameworks?

-   fast (currently deploys under 3 seconds)
-   minimal and simple
-   no YAML, just JS code
-   simple config with keywords to access ssm parameters, cloudformation outputs from other stacks

## Install

```bash
npm i -g rise-functions
```

## Usage

Deploy

```bash
rise-functions deploy
```

## Project Structure

A project as the following structure:

```bash
/functions
    myFunctionA.mjs
    myFunctionB.mjs
    myFunctionC.mjs
rise.mjs
```

If your function requires multiple files or node_modules, functions can be defined inside a folder.

```bash
/functions
    /myFunctionA
        util.mjs
        index.mjs
    /myFunctionB
        /node_modules
        util.mjs
        index.mjs
rise.mjs
```

## What is the rise.mjs file for?

The `rise.mjs` file is for configuring your project. Here is an example:

```js
export default {
    name: 'nameOfMyProject'
}
```

The only required parameter is the name. This will be used to name:

-   the s3 bucket where your code will be uploaded
-   lambda functions
-   iam roles

## What CLI flags are available?

You can set the region of your deployment like so:

```bash
rise-functions deploy --region=us-east-2
```
