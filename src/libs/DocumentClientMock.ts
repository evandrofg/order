import { Order } from '../models/Order'
import { OrderList } from '../models/OrderList'

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
            comments: null,
            quantity: 2,
            value: 15.0,
        },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    total: 30.0,
}

const testOrderList: OrderList = {
    Count: 3,
    Items: [
        {
            createdAt: '2022-04-25',
            total: 30,
            id: '34d74df9-7b15-4c7d-8017-f487d2c31384',
        },
        {
            createdAt: '2022-04-25',
            total: 20,
            id: '34d74df9-7b15-4c7d-8017-f487d2c31382',
        },
        {
            createdAt: '2022-04-25',
            total: 50,
            id: '34d74df9-7b15-4c7d-8017-f487d2c31383',
        },
    ],
}

interface mockFuncs {
    putFunc?: any
    getFunc?: any
    scanFunc?: any
    deleteFunc?: any
    updateFunc?: any
}

export default class createDynamoDBMock {
    private awsSdkPromiseResponse = jest
        .fn()
        .mockReturnValue(Promise.resolve(true))

    private awsSdkPromiseGetResponse = jest
        .fn()
        .mockReturnValue(Promise.resolve({ Item: testOrder }))

    private awsSdkPromiseScanResponse = jest
        .fn()
        .mockReturnValue(Promise.resolve({ ...testOrderList }))

    private genFn = jest
        .fn()
        .mockImplementation(() => ({ promise: this.awsSdkPromiseResponse }))

    private putFn = jest.fn().mockImplementation(() => {
        this.funcs.putFunc && this.funcs.putFunc()
        return { promise: this.awsSdkPromiseResponse }
    })

    private updateFn = jest.fn().mockImplementation(() => {
        this.funcs.updateFunc && this.funcs.updateFunc()
        return { promise: this.awsSdkPromiseGetResponse }
    })

    private getFn = jest.fn().mockImplementation(() => {
        this.funcs.getFunc && this.funcs.getFunc()
        return { promise: this.awsSdkPromiseGetResponse }
    })

    private scanFn = jest.fn().mockImplementation(() => {
        this.funcs.scanFunc && this.funcs.scanFunc()
        return { promise: this.awsSdkPromiseScanResponse }
    })

    private deleteFn = jest.fn().mockImplementation(() => {
        this.funcs.deleteFunc && this.funcs.deleteFunc()
        return { promise: this.awsSdkPromiseResponse }
    })

    constructor(private funcs: mockFuncs) {}

    put = this.putFn
    createSet = this.genFn
    batchGet = this.genFn
    batchWrite = this.genFn
    delete = this.deleteFn
    get = this.getFn
    query = this.genFn
    scan = this.scanFn
    update = this.updateFn
    transactGet = this.genFn
    transactWrite = this.genFn
}
