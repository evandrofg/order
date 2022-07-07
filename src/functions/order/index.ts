import { handlerPath } from '@libs/handler-resolver'

export const getAllOrders = {
    handler: `${handlerPath(__dirname)}/handler.getAllOrders`,
    events: [
        {
            http: {
                method: 'get',
                path: 'order/',
            },
        },
    ],
}

export const createOrder = {
    handler: `${handlerPath(__dirname)}/handler.createOrder`,
    events: [
        {
            http: {
                method: 'post',
                path: 'order',
            },
        },
    ],
}

export const getOrder = {
    handler: `${handlerPath(__dirname)}/handler.getOrder`,
    events: [
        {
            http: {
                method: 'get',
                path: 'order/{id}',
            },
        },
    ],
}

export const updateOrder = {
    handler: `${handlerPath(__dirname)}/handler.updateOrder`,
    events: [
        {
            http: {
                method: 'put',
                path: 'order/{id}',
            },
        },
    ],
}

export const deleteOrder = {
    handler: `${handlerPath(__dirname)}/handler.deleteOrder`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'order/{id}',
            },
        },
    ],
}
