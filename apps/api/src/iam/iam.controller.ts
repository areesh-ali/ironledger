import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IamService } from './iam.service';
import CreateUserRequestDTO from './dto/create-iam.dto';
import 


@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post("/user/create")
  createuser(@Body() createuserdto: CreateUserRequestDTO) {

    return this.iamService.createUser(createuserdto);
    
  }
}
