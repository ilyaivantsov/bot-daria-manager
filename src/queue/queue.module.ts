import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { SqsService } from './sqs.service';

@Module({
  imports: [],
  providers: [SqsService],
  controllers: [QueueController],
  exports: [SqsService]
})
export class QueueModule { }
