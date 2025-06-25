import { inject, injectable } from 'tsyringe';
import { ServiceNames } from '@common';
import { ConfigService } from './config.service.ts';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';

export type JwtUserData = {
  userId: string;
  authDate: Date;
  companyId: string;
  calculatorId: string;
};

type JwtPayload = {
  sub: string; // userId
  auth_date: string; // auth date in string format
  companyId: string; // company that calculator belongs to
  calculatorId: string; // active calculator of company
};

@injectable()
export class JwtService {
  constructor(@inject(ServiceNames.BAConfigService) private readonly configService: ConfigService) {}

  public getToken(input: JwtUserData): string {
    return jwtSign(
      {
        sub: input.userId,
        auth_date: input.authDate.toString(),
        companyId: input.companyId,
        calculatorId: input.calculatorId,
      } satisfies JwtPayload,
      this.configService.jwtSecret,
      { expiresIn: '1d' }
    );
  }

  public parseToken(token: string): JwtUserData {
    const payload = jwtVerify(token, this.configService.jwtSecret) as JwtPayload;
    console.log('JWT payload:', payload);
    return {
      userId: payload.sub,
      authDate: new Date(payload.auth_date),
      companyId: payload.companyId,
      calculatorId: payload.calculatorId,
    } satisfies JwtUserData;
  }
}
