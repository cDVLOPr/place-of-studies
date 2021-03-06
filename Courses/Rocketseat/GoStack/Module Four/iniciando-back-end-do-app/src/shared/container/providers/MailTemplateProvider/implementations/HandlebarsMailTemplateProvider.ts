import fs from 'fs';
import handlebars from 'handlebars';

import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	public async parse({
		file,
		variables,
	}: IParseMailTemplateDTO): Promise<string> {
		const templateFileContent = await fs.promises.readFile(file, {
			encoding: 'utf-8',
		});

		const parsetemplate = handlebars.compile(templateFileContent);

		return parsetemplate(variables);
	}
}

export default HandlebarsMailTemplateProvider;
