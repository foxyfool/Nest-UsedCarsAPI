import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>; // partial implementation of the UsersService not all
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'a', password: '1' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1' } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({ id } as User);
      },
      update: (id: number, body: UpdateUserDto) => {
        return Promise.resolve({ id, ...body } as User);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('finds a user by email', async () => {
    const users = await controller.findAllUsers('a');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('a');
  });

  it('finds a user by id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('FindUser throws an error if user not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (err) {
      expect(err.message).toEqual('User not found');
    }
  });

  it('removes a user', async () => {
    const user = await controller.removeUser('1');
    expect(user.id).toEqual(1);
  });

  it('updates a user', async () => {
    const user = await controller.updateUser('1', {
      email: 'a',
    } as UpdateUserDto);
    expect(user.id).toEqual(1);
  });

  it('signs up a user', async () => {
    const user = await controller.createUser(
      { email: 'a', password: '1' },
      {} as User,
    );
    expect(user.id).toEqual(1);
  });

  it('signs in a user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'a', password: '1' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
