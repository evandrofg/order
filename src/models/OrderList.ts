import { FromSchema } from 'json-schema-to-ts'

export const OrderListSchema = {
    type: 'object',
    properties: {
        Count: { type: 'number' },
        ScannedCount: { type: 'number' },
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    total: { type: 'number' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                },
            },
        },
    },
} as const

export type OrderList = FromSchema<typeof OrderListSchema>
