import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { IamService } from './iam.service';
import CreateUserRequestDTO from './dto/create-iam.dto';
import { ResponseMeta } from '../common/decorators/response-meta.decorator';
import { SYSTEM_CODES } from '../common/constants/system-codes';

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post(['users/create', 'user/create'])
  @HttpCode(HttpStatus.CREATED)
  @ResponseMeta({
    message: 'Account created successfully',
    system_code: SYSTEM_CODES.USER_CREATED,
  })
  createuser(@Body() createuserdto: CreateUserRequestDTO) {
    return this.iamService.createUser(createuserdto);
  }
}
