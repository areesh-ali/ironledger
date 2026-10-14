import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator"
export default class CreateUserRequestDTO {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phonenumber: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;


  @IsString()
  displayname: string;

}


/*
Name
Email
Password
phonenumber
*/