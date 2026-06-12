import type { Request, Response } from 'express';
import type { CreateUserUseCaseInterface } from '@/application/usecases/user/createUserUseCaseInterface.js';
import type { CreateUserRequestDto } from '@/application/dtos/user/createUserRequestDto.js';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCaseInterface,
    // Add other useCase propaties as needed
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: CreateUserRequestDto = {};
      const user = await this.createUserUseCase.execute(requestDto);

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '' });
    }
  }
}
