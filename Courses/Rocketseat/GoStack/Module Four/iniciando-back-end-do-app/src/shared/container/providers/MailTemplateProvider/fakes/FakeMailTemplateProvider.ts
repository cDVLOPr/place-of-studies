import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
	public async parse({ template }: IParseMailTemplateDTO): Promise<string> {
		return template;
	}
}

export default FakeMailTemplateProvider;
