import type { UserRepositoryInterface } from '@/domain/repositories/userRepositoryInterface.js';
import type { CreateUserRequestDto } from '@/application/dtos/user/createUserRequestDto.js';
import type { CreateUserResponseDto } from '@/application/dtos/user/createUserResponseDto.js';
import type { CreateUserUseCaseInterface } from './createUserUseCaseInterface.js';
import type { IdGeneratorInterface } from '@/domain/utils/idGeneratorInterface.js';
import { User } from '@/domain/entities/user.js';

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  async execute(_requestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const id = this.idGenerator.generate();
    const newUser = new User(id, _requestDto.email);
    const createdUser = await this.userRepository.create(newUser);
    return {
      id: createdUser.id,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }
}
