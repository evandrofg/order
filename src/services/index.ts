import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import OrderService from './orderService'

const dynamoDBClient = (): DocumentClient => {
    if (process.env.IS_OFFLINE) {
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:5000',
        })
    }

    return new AWS.DynamoDB.DocumentClient()
}

const orderService = new OrderService(dynamoDBClient())

export default orderService
