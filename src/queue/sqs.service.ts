import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class SqsService {
    private ymq: AWS.SQS;

    public consumer: Map<string, Consumer> = new Map();

    constructor(private configService: ConfigService) {
        this.updateAWS();
    }

    private updateAWS() {
        AWS.config.update({
            region: this.configService.get<string>('QUEUE_REGION'),
            accessKeyId: this.configService.get<string>('QUEUE_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>('QUEUE_SECRET_ACCESS_KEY')
        });
        this.ymq = new AWS.SQS({
            region: 'ru-central1',
            endpoint: 'https://message-queue.api.cloud.yandex.net',
        });
    }

    async createFIFOQueue(name: string): Promise<string> {
        const params: AWS.SQS.CreateQueueRequest = {
            'QueueName': `${name}.fifo`,
            'Attributes': {
                'FifoQueue': 'true'
            }
        }

        let result = await this.ymq.createQueue(params).promise();
        let queueUrl = result['QueueUrl'];

        console.log('Queue created, URL: ' + queueUrl);

        return queueUrl;
    }

    async getListQueues(): Promise<Array<string>> {
        let data = await this.ymq.listQueues({}).promise();
        return data.QueueUrls;
    }

    async deleteQueue(queueUrl: string) {
        const params = {
            'QueueUrl': queueUrl,
        }

        await this.ymq.deleteQueue(params).promise();

        console.log('Queue deleted')
    }

    async sendMessage(queueUrl: string, data: any, id: string) {
        const params: AWS.SQS.SendMessageRequest = {
            'QueueUrl': queueUrl,
            'MessageGroupId': 'embassy',
            'MessageBody': JSON.stringify(data),
            'MessageDeduplicationId': id
        };

        let result = await this.ymq.sendMessage(params).promise();

        console.log('Message sent, ID: ' + result['MessageId']);
    }

    async receiveMessage(queueUrl: string): Promise<Array<any>> {
        const params: AWS.SQS.ReceiveMessageRequest = {
            'QueueUrl': queueUrl,
            'WaitTimeSeconds': 5
        }

        let result = await this.ymq.receiveMessage(params).promise();

        if (typeof result['Messages'] == 'undefined')
            return [];

        const msg = result['Messages'][0];

        const deleteParams = {
            'QueueUrl': queueUrl,
            'ReceiptHandle': msg['ReceiptHandle'],
        }

        await this.ymq.deleteMessage(deleteParams).promise();

        return JSON.parse(msg['Body']);
    }

    async getInfo(queueUrl: string): Promise<string> {
        const params = {
            QueueUrl: queueUrl,
            AttributeNames: ['ApproximateNumberOfMessages']
        };
        let result = await this.ymq.getQueueAttributes(params).promise().catch(err => console.error(err));
        if (typeof result == 'undefined')
            return '0';
        return result.Attributes.ApproximateNumberOfMessages;
    }

    async createConsumer(id: string, queueUrl: string, handler: (message: AWS.SQS.Message) => Promise<void>) {
        const app = Consumer.create({
            queueUrl,
            handleMessage: handler,
            sqs: this.ymq
        });

        app.on('error', (err) => {
            console.error(err.message);
        });

        app.on('processing_error', (err) => {
            console.error(err.message);
        });

        this.consumer.set(id, app);
    }
}
