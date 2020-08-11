import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';

interface IRequestDTO {
	user_id: string;
	avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsersRepository,
	) {}

	public async execute({
		user_id,
		avatarFilename,
	}: IRequestDTO): Promise<User> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('Only authorized users can change avatar.', 401);
		}

		if (user.avatar) {
			const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
			const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

			// remove old avatar file
			if (userAvatarFileExists) {
				await fs.promises.unlink(userAvatarFilePath);
			}
		}

		user.avatar = avatarFilename;

		await this.usersRepository.save(user);

		delete user.password;

		return user;
	}
}

export default UpdateUserAvatarService;