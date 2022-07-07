import middy, { MiddyfiedHandler } from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import httpEventNormalizer from '@middy/http-event-normalizer'
import validator from '@middy/validator'
import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
    Handler,
} from 'aws-lambda'

interface NormalizedValidatedEvent<S>
    extends Omit<APIGatewayProxyEvent, 'body'> {
    queryStringParameters: NonNullable<
        APIGatewayProxyEvent['queryStringParameters']
    >
    multiValueQueryStringParameters: NonNullable<
        APIGatewayProxyEvent['multiValueQueryStringParameters']
    >
    pathParameters: NonNullable<APIGatewayProxyEvent['pathParameters']>
    body: S
}

export type CustomAPIGatewayProxyEventHandler<S> = Handler<
    NormalizedValidatedEvent<S>,
    APIGatewayProxyResult
>

export const middyfy = (
    handler: CustomAPIGatewayProxyEventHandler<never>,
    schema: Record<string, unknown>
): MiddyfiedHandler<
    NormalizedValidatedEvent<never>,
    APIGatewayProxyResult,
    Error,
    Context
> => {
    handler.toString()
    return middy(handler)
        .use(middyJsonBodyParser())
        .use(httpEventNormalizer())
        .use(
            validator({
                inputSchema: schema,
            })
        )
        .use(httpErrorHandler())
}
