import { FromSchema } from 'json-schema-to-ts'

export const orderSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        total: { type: 'number' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                lat: { type: 'number' },
                long: { type: 'number' },
            },
            required: ['lat', 'long'],
        },
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    itemId: { type: 'string' },
                    description: { type: 'string' },
                    productCode: { type: 'string' },
                    comments: { type: 'string' },
                    quantity: { type: 'number' },
                    value: { type: 'number' },
                },
                required: [
                    'itemId',
                    'description',
                    'productCode',
                    'quantity',
                    'value',
                ],
            },
        },
    },
    required: ['location', 'items'],
} as const

export const orderBodySchema = {
    type: 'object',
    required: ['body'],
    properties: {
        body: orderSchema,
    },
}

export type Order = FromSchema<typeof orderSchema>
