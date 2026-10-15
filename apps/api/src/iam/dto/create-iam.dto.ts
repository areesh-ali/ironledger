import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator"
export default class CreateUserRequestDTO {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;


  @IsString()
  @IsNotEmpty()
  displayname: string;

}


/*
Name
Email
Password
phonenumber
*/