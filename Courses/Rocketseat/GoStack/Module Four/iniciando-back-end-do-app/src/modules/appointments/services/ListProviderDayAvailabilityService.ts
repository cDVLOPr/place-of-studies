import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { compare } from 'bcryptjs';

interface IRequestDTO {
	provider_id: string;
	day: number;
	month: number;
	year: number;
}

type IResponse = Array<{
	hour: number;
	available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({
		provider_id,
		month,
		year,
		day,
	}: IRequestDTO): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
			{
				provider_id,
				month,
				year,
				day,
			},
		);

		const startHour = 8;

		const eachHourArray = Array.from(
			{ length: 10 },
			(_, index) => index + startHour,
		);

		const currentDate = new Date(Date.now());

		const availability = eachHourArray.map(hour => {
			const hasAppointmentInHour = appointments.find(
				appointment => getHours(appointment.date) === hour,
			);

			const compareDate = new Date(year, month - 1, day, hour);

			return {
				hour,
				available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
			};
		});

		return availability;
	}
}

export default ListProviderDayAvailabilityService;
