import OrderService from './orderService'
import { Order } from '../models/Order'
import createDynamoDBMock from '../libs/DocumentClientMock'

describe('Order API', () => {
    const testOrder: Order = {
        id: '34d74df9-7b15-4c7d-8017-f487d2c31383',
        location: {
            lat: 1,
            long: 1,
        },
        items: [
            {
                itemId: '2',
                description: 'Coke Zero',
                productCode: 'COKEZERO',
                comments: '',
                quantity: 2,
                value: 15.0,
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        total: 30.0,
    }

    it('Insert a new order', async () => {
        // Setup
        let updateValue = false
        const dynamodb = new createDynamoDBMock({
            putFunc: () => {
                updateValue = true
            },
        })
        const orderTestService = new OrderService(dynamodb, 'OrderTable')

        // Execution
        const eta = await orderTestService.createOrder(testOrder)

        // Assertions
        expect(updateValue).toEqual(true)
        expect(eta).toBeDefined()
        expect(eta.EstimatedTime).toEqual(1)
        expect(eta.StoreLocation).toBeDefined()
        expect(eta.StoreLocation.lat).toEqual(1)
        expect(eta.StoreLocation.long).toEqual(1)
    })

    it('Get an order based on the Id', async () => {
        const dynamodb = new createDynamoDBMock({
            getFunc: () => {
                testOrder
            },
        })
        const orderTestService = new OrderService(dynamodb, 'OrderTable')

        // Execution
        const order = await orderTestService.getOrder(testOrder.id)

        // Assertions
        expect(order).toBeDefined()
        expect(order.id).toEqual(testOrder.id)
        expect(order.items.length).toBeGreaterThanOrEqual(1)
    })

    it('Get the list of Orders', async () => {
        const dynamodb = new createDynamoDBMock({
            scanFunc: () => {
                testOrder
            },
        })
        const orderTestService = new OrderService(dynamodb, 'OrderTable')

        // Execution
        const orderList = await orderTestService.getAllOrders()

        // Assertions
        expect(orderList).toBeDefined()
        expect(orderList.Count).toEqual(3)
        expect(orderList.Items).toBeInstanceOf(Array)
        expect(orderList.Items[0].createdAt).toBeDefined()
        expect(orderList.Items[0].total).toBeDefined()
        expect(orderList.Items[0].id).toBeDefined()
    })

    it('Update an Order', async () => {
        // Setup
        const dynamodb = new createDynamoDBMock({
            updateFunc: () => {
                testOrder
            },
        })
        const orderTestService = new OrderService(dynamodb, 'OrderTable')

        // Execution
        const order = await orderTestService.updateOrder(testOrder)

        // Assertions
        expect(order.location).toBeDefined
        expect(order.total).not.toBeNull
        expect(order.items).toBeDefined
        expect(order.updatedAt).not.toBeNull
    })
})
