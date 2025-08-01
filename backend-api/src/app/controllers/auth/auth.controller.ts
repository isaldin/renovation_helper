import { injectable, inject } from 'tsyringe';
import { FastifyReply } from 'fastify';
import { isValid as isValidFn } from '@telegram-apps/init-data-node';
import { parse as parseFn } from '@telegram-apps/init-data-node';
import { ServiceNames } from '@common';
import { ConfigService } from '../../services/config.service.ts';
import { JwtService } from '../../services/jwt.service.ts';
import { TelegramAuthRequest } from './auth.controller.types.ts';
import { BaseAuthController } from './auth.controller.base.ts';
import { DomainCalculatorMapService } from '@common';

const INVALID_AUTH_ERROR_STRING = 'Invalid auth data. Please try again.';
const COMPANY_ID_NOT_FOUND_ERROR_STRING = 'Company ID not found for the domain.';

@injectable()
export class AuthController implements BaseAuthController {
  constructor(
    @inject(ServiceNames.BAConfigService) private readonly configService: ConfigService,
    @inject(ServiceNames.BAJwtService) private readonly jwtService: JwtService,
    @inject(ServiceNames.DomainCalculatorMapService)
    private readonly domainCalculatorMapService: DomainCalculatorMapService
  ) {}

  public async verify(request: TelegramAuthRequest, reply: FastifyReply) {
    const { initData } = request.body;

    if (typeof initData !== 'string') {
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const isValid = isValidFn(initData, this.configService.botToken);

    if (!isValid) {
      console.log('Invalid initData:', initData);
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const parsedData = parseFn(initData);

    if (!parsedData.user?.id) {
      return reply.status(401).send({ error: INVALID_AUTH_ERROR_STRING });
    }

    const userId = parsedData.user.id;
    const authDate = parsedData.auth_date;

    const originUrl = new URL(request.headers.origin || '');
    const domainMap = await this.domainCalculatorMapService.getForDomain(originUrl.hostname);

    if (!domainMap) {
      return reply.status(401).send({ error: COMPANY_ID_NOT_FOUND_ERROR_STRING });
    }

    const token = this.jwtService.getToken({
      userId: userId.toString(),
      authDate: authDate,
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
