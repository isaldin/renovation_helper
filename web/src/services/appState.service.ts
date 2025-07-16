import { injectable } from 'tsyringe';
import { AppStore, AppStoreStateStatus } from '@app/stores/app/types';
import { useAppStore } from '@app/stores/app';

@injectable()
export class AppStateService {
  private readonly store: AppStore;

  constructor() {
    this.store = useAppStore();
  }

  public appStatus(): AppStoreStateStatus {
    return this.store.status;
  }

  public setAppStatus(appStatus: AppStoreStateStatus) {
    this.store.setStatus(appStatus);
  }
}
