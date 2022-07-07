import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy, CustomAPIGatewayProxyEventHandler } from '@libs/lambda'
import orderService from '../../services'
import type { Order } from '../../models/Order'
import { orderBodySchema } from '../../models/Order'
import { v4 } from 'uuid'

export const createOrderFunc: CustomAPIGatewayProxyEventHandler<Order> = async (
    event
) => {
    try {
        const id = v4()
        const order: Order = event.body
        order.id = id
        order.createdAt = new Date().toISOString()
        const estimatedTime = await orderService.createOrder(order)
        return formatJSONResponse({ estimatedTime }, 201)
    } catch (e) {
        return formatJSONResponse({ e }, 500)
    }
}

export const createOrder = middyfy(createOrderFunc, orderBodySchema)

const getAllOrdersFunc: CustomAPIGatewayProxyEventHandler<Order> = async () => {
    const orders = await orderService.getAllOrders()
    return formatJSONResponse({ orders }, 200)
}

export const getAllOrders = middyfy(getAllOrdersFunc, {})

const getOrderFunc: CustomAPIGatewayProxyEventHandler<Order> = async (
    event
) => {
    const id = event.pathParameters.id
    try {
        const order = await orderService.getOrder(id)
        return formatJSONResponse({ order }, 200)
    } catch (e) {
        return formatJSONResponse({ e }, 500)
    }
}

export const getOrder = middyfy(getOrderFunc, {})

const deleteOrderFunc: CustomAPIGatewayProxyEventHandler<Order> = async (
    event
) => {
    const id = event.pathParameters.id
    try {
        const order = await orderService.deleteOrder(id)
        return formatJSONResponse({ order }, 200)
    } catch (e) {
        return formatJSONResponse({ e }, 500)
    }
}

export const deleteOrder = middyfy(deleteOrderFunc, {})

const updateOrderFunc: CustomAPIGatewayProxyEventHandler<Order> = async (
    event
) => {
    try {
        const order = await orderService.updateOrder({
            id: event.pathParameters.id,
            location: event.body.location,
            items: event.body.items,
            updatedAt: new Date().toISOString(),
            total: null,
        })
        return formatJSONResponse({
            order,
        })
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e,
        })
    }
}

export const updateOrder = middyfy(updateOrderFunc, {})
