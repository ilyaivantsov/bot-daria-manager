import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Controller('queue')
export class QueueController {
    constructor(
        private readonly sqsService: SqsService,
    ) { }

    @Get('/sqs')
    getSqs() {
        return this.sqsService.getListQueues();
    }

    @Get('/create')
    async createSqs() {
        await this.sqsService.createFIFOQueue('ilya');
        return 'OK';
    }

    @Post('/send')
    async sendMessage(@Body() body: any) {
        await this.sqsService.sendMessage(body.queueUrl, body.data, body.id);
        return 'OK';
    }

    @Get('/receive')
    async receive(@Query('queueUrl') queueUrl: string) {
        return await this.sqsService.receiveMessage(queueUrl);
    }

    @Get('/info')
    async info(@Query('queueUrl') queueUrl: string) {
        return await this.sqsService.getInfo(queueUrl);
    }
}