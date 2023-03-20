# Experimental

This section covers some experimental features that are in development

## Deploy with a database

When adding the following to the `rise.mjs` file:
```js
export default {
    name: 'myApp',
    table: {
        pk: 'userId string',
        sk: 'date string'
    }
} 
```

Rise Functions will deploy a dynamodb table for your app. `pk` takes a string with the following format `[KeyName] [Type]`. So in the example above, the partition key on the table is `userId` and the type of this field is a string. The sort key on this table is `date` and the type is also string.

In order to do single table design effectively, its common to set the partition key as `pk` and the sort key as `sk` on the table.

## Rise helper functions

A set of helper functions is injected in to every lambda function as the second parameter:

```js
export const handler = async (event, rise) => {
    // code
}
```

If a table is defined on the app, you can access crud operations from the rise object:

```js
export const handler = async (event, rise) => {
    // get
    const note = await rise.db.get({
        pk: 'user',
        sk: 'note_123h1u43i2u4h5'
    })

    // list
    const items = await rise.db.list({
        pk: 'user',
        sk: 'note_'
    })

    // set
    await rise.db.set({
        pk: 'user',
        sk: 'not_34252452',
        content: 'my content'
    })

    // delete
    await rise.db.remove({
        pk: 'user',
        sk: 'not_0802w452',
    })
}
```