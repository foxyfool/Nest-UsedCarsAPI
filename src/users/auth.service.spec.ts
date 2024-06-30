import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  // test - block
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // fake copy of the users service
    // we use only find and auth as these are the only methods we use in the auth service

    const users: User[] = [];

    fakeUsersService = {
      find: (email: String) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // reach into the di container and pull out an instance of the auth service
    service = module.get(AuthService);
  });

  // test - block
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'Glowskin1@');

    expect(user.password).not.toEqual('Glowskin1@');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if a user signs up with an email that is in use', async () => {
    await service.signup('test@gmail.com', 'Glowskin1@');
    await expect(
      service.signup('test@gmail.com', 'Glowskin1@'),
    ).rejects.toThrow();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('test@gmail.com', 'Glowskin1@'),
    ).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@gmail.com', 'password');

    await expect(
      service.signin('test@gmail.com', 'Glowskin1@'),
    ).rejects.toThrow();
  });
  it('returns a user if correct password is provided', async () => {
    await service.signup('test@gmail.com', 'Password');

    const user = await service.signin('test@gmail.com', 'Password');
    expect(user).toBeDefined();
  });
});
