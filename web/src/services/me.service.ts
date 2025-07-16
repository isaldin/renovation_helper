import { inject, injectable } from 'tsyringe';
import { MeStore, MeUser } from '@app/stores/me/types';
import { useMeStore } from '@app/stores/me';
import { ServiceNames } from '@/common';
import { HttpService } from '@app/services/http.service';

@injectable()
export class MeService {
  private readonly meStore: MeStore;

  constructor(@inject(ServiceNames.WAHttpService) protected readonly httpService: HttpService) {
    this.meStore = useMeStore();
  }

  public setMe(user: MeUser) {
    this.meStore.setUser(user);
  }

  public getMe(): MeUser | null {
    return this.meStore.meUser;
  }

  public fetchMe(): Promise<MeUser | null> {
    return this.httpService.get<MeUser>('/me');
  }
}
