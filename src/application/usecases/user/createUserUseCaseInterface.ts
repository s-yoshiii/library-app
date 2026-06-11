import type { CreateUserRequestDto } from '@/application/dtos/user/createUserRequestDto.js';
import type { CreateUserResponseDto } from '@/application/dtos/user/createUserResponseDto.js';

export interface CreateUserUseCaseInterface {
  execute(requestDto: CreateUserRequestDto): Promise<CreateUserResponseDto>;
}
