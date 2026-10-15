import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";

const HASH_OPTION = {
  type: argon2.argon2id,
  memoryCost: 64 * 1024,
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
} as const;

@Injectable()
export class HashService{
  private readonly  pepper : Buffer;

  constructor(private readonly config: ConfigService)
  {
    const encodedPepper = this.config.getOrThrow<string>(
          'PASSWORD_PEPPER_B64',
        );
    
        this.pepper = Buffer.from(encodedPepper, 'base64');
    
        if (this.pepper.length !== 32) {
          throw new Error('Invalid PASSWORD_PEPPER_B64');
        }
  }

  createPasswordHash(password: string): Promise<string> {
    return argon2.hash(password, {
      ...HASH_OPTION,
      secret: this.pepper
    });
  }

  verify(
    password : string,
    storedHash: string
  ):
    Promise<boolean> {
    return argon2.verify(storedHash, password, {
    secret: this.pepper
  })  
  }

  needsRehash(storedHash: string): boolean {
      return argon2.needsRehash(storedHash, {
        memoryCost: HASH_OPTION.memoryCost,
        timeCost: HASH_OPTION.timeCost,
        parallelism: HASH_OPTION.parallelism,
      });
    }
  
}