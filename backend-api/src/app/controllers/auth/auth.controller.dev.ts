import { BaseAuthController } from './auth.controller.base.ts';
import { TelegramAuthRequest } from './auth.controller.types.ts';
import { FastifyReply } from 'fastify';
import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@common';
import { JwtService } from '../../services/jwt.service.ts';
import { DomainCalculatorMapService } from '../../firebase/services/domainCalculatorMap.service.ts';
import { ConfigService } from '../../services/config.service.ts';

const COMPANY_ID_NOT_FOUND_ERROR_STRING = 'Company ID not found for the domain.';

@injectable()
export class DevAuthController implements BaseAuthController {
  constructor(
    @inject(ServiceNames.BAConfigService) private readonly configService: ConfigService,
    @inject(ServiceNames.BAJwtService) private readonly jwtService: JwtService,
    @inject(ServiceNames.BADomainCalculatorMapService)
    private readonly domainCalculatorMapService: DomainCalculatorMapService
  ) {}

  public async verify(request: TelegramAuthRequest, reply: FastifyReply): Promise<void> {
    console.log('Development mode: Skipping authentication');

    const originUrl = new URL(request.headers.origin || '');
    const domainMap = await this.domainCalculatorMapService.getForDomain(originUrl.hostname);

    if (!domainMap) {
      return reply.status(401).send({ error: COMPANY_ID_NOT_FOUND_ERROR_STRING });
    }

    const token = this.jwtService.getToken({
      userId: 'dev-user-id',
      authDate: new Date(),
      companyId: domainMap.companyId,
      calculatorId: domainMap.calculatorId.id,
    });

    reply
      .setCookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24,
        domain: this.configService.authCookieDomain,
      })
      .send(200);
  }
}
