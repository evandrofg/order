import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import EstimatedTimeCalculator from '../libs/estimatedtime-calculator'
import { Order } from '../models/Order'
import EstimatedTime from '../models/EstimatedTime'
import { OrderList } from '../models/OrderList'

export default class OrderService {
    tableName: string
    constructor(
        private docClient: DocumentClient,
        tableName: string = process.env.TABLE
    ) {
        this.tableName = tableName
    }

    async getAllOrders(): Promise<OrderList> {
        const orders = await this.docClient
            .scan({
                TableName: this.tableName,
                ProjectionExpression: 'id, createdAt, updatedAt, #total',
                ExpressionAttributeNames: {
                    '#total': 'total',
                },
            })
            .promise()
        return orders as unknown as OrderList
    }

    async createOrder(order: Order): Promise<EstimatedTime> {
        await this.docClient
            .put({
                TableName: this.tableName,
                Item: order,
            })
            .promise()

        return new EstimatedTimeCalculator().getEstimatedTime(
            order.location,
            order.id
        )
    }

    async updateOrder(order: Order): Promise<any> {
        const { lat, long } = order.location

        const response = await this.docClient
            .update({
                TableName: this.tableName,
                Key: {
                    id: order.id,
                },
                UpdateExpression:
                    'SET updatedAt = :updatedAt, #total = :total, #location.#lat = :lat, #location.#long = :long, #items = :items',
                ExpressionAttributeNames: {
                    '#location': 'location',
                    '#lat': 'lat',
                    '#long': 'long',
                    '#items': 'items',
                    '#total': 'total',
                },
                ExpressionAttributeValues: {
                    ':lat': lat,
                    ':long': long,
                    ':items': order.items,
                    ':updatedAt': order.updatedAt,
                    ':total': order.total,
                },
                ConditionExpression: 'attribute_exists(id)',
                ReturnValues: 'ALL_NEW',
            })
            .promise()

        return response
    }

    async getOrder(id: string): Promise<Order> {
        const order = await this.docClient
            .get({
                TableName: this.tableName,
                Key: {
                    id: id,
                },
            })
            .promise()
        if (!order.Item) {
            throw new Error('Id does not exit')
        }
        return order.Item as Order
    }

    async deleteOrder(id: string): Promise<any> {
        const response = await this.docClient
            .delete({
                TableName: this.tableName,
                Key: {
                    id: id,
                },
                ConditionExpression: 'attribute_exists(id)',
            })
            .promise()

        return response
    }
}
