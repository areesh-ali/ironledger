import { Injectable } from '@nestjs/common';
import CreateUserRequestDTO from './dto/create-iam.dto';
import { DatabaseService } from '../database/database.service';
import { HashService } from '../common/HashingService/hashing.service';
import { users } from './entities/user.schema';

@Injectable()
export class IamService {
  constructor(
    private readonly databaseservice: DatabaseService,
    private readonly hashService: HashService,
  ) {}

  async createUser(dto: CreateUserRequestDTO) {
    const email = dto.email.trim().toLowerCase();

    const passwordHash =
      await this.hashService.createPasswordHash(dto.password);

    const [user] = await this.databaseservice.db
      .insert(users)
      .values({
        email,
        passwordHash,
        displayName: dto.displayname,
      })
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        createdAt: users.createdAt,
      });

    return user;
  }
}
