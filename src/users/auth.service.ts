import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util'; // makes use of callback functions as if they were promises

// rainbow table attack: a hacker can use a rainbow table to crack the hashed password

const scrypt = promisify(_scrypt); // promise based version of scrypt

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // hashing the password
    const salt = randomBytes(8).toString('hex'); // returns a buffer to a hexa string

    const hash = (await scrypt(password, salt, 32)) as Buffer; // returns a buffer

    const result = salt + '.' + hash.toString('hex'); // buffer to hexa string

    const user = await this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');

    const hashToCompare = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash === hashToCompare.toString('hex')) {
      return user;
    } else {
      throw new BadRequestException('Wrong Password');
    }
  }
}

//73 cookies video
