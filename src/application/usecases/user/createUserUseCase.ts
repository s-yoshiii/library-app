import type { UserRepositoryInterface } from '@/domain/repositories/userRepositoryInterface.js';
import type { CreateUserRequestDto } from '@/application/dtos/user/createUserRequestDto.js';
import type { CreateUserResponseDto } from '@/application/dtos/user/createUserResponseDto.js';
import type { CreateUserUseCaseInterface } from './createUserUseCaseInterface.js';

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(_requestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    throw new Error('Not implemented');
  }
}
