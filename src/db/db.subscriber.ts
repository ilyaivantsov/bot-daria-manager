import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { User } from './entity/user.entity'

@EventSubscriber()
export class DbSubscriber implements EntitySubscriberInterface<User> {
    constructor(@InjectConnection() readonly connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return User;
    }


    async afterInsert(event: InsertEvent<User>) {
        console.log(`USER INSERTED: `, event.entity);

    }
    async afterUpdate(event: UpdateEvent<User>) {
        console.log(`USER UPDATED: `, event.entity);
    }

    async beforeRemove(event: RemoveEvent<User>) {
        console.log(`USER REMOVED: `, event.entity);
    }

}