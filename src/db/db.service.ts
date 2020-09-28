import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class DbService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async findOne(username: string): Promise<User> {
        let user: User = await this.userRepository.findOne({ username });
        return user;
    }

    async findAll(): Promise<User[]> {
        let users: User[] = await this.userRepository.find();
        return users;
    }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        let user: User = new User();
        user = { ...createUserDTO };
        await this.userRepository.save(user);
        return user;
    }

    async update(username: string, dto: CreateUserDTO): Promise<User> {
        let user = await this.findOne(username);
        await this.userRepository.save({ ...user, ...dto });
        return user;
    }

    async remove(username: string): Promise<User> {
        const user = await this.findOne(username);
        await this.userRepository.remove(user);
        return user;
    }
}