import { Injectable } from '@nestjs/common';
import CreateUserRequestDTO from './dto/create-iam.dto';
import { UpdateIamDto } from './dto/update-iam.dto';

@Injectable()
export class IamService {
  createUser(dto : CreateUserRequestDTO){
    
  }
}
