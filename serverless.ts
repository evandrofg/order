import type { AWS } from '@serverless/typescript'

import hello from '@functions/hello'
import {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
} from '@functions/order'

const serverlessConfiguration: AWS = {
    service: 'order',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-offline',
        'serverless-dynamodb-local',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'us-east-1',
        stage: 'dev',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            TABLE: 'OrderTable-${opt:stage, self:provider.stage}',
        },
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'dynamodb:DescribeTable',
                            'dynamodb:Query',
                            'dynamodb:Scan',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                            'dynamodb:UpdateItem',
                            'dynamodb:DeleteItem',
                        ],
                        Resource:
                            'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.TABLE}',
                    },
                ],
            },
        },
    },
    // import the function via paths
    functions: {
        hello,
        createOrder,
        getOrder,
        getAllOrders,
        updateOrder,
        deleteOrder,
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        dynamodb: {
            start: {
                port: 5000,
                inMemory: true,
                migrate: true,
                seed: true,
            },
            stages: 'dev',
            seed: {
                domain: {
                    sources: {
                        table: '${self:provider.environment.TABLE}',
                        sources: ['./data/order.json'],
                    },
                },
            },
        },
    },
    resources: {
        Resources: {
            OrderTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:provider.environment.TABLE}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },
}

module.exports = serverlessConfiguration
