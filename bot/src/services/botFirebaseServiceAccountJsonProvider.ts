import { injectable } from 'tsyringe';
import { FirebaseServiceAccountJsonProvider } from '@common/services';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@injectable()
export class BotFirebaseServiceAccountJsonProvider implements FirebaseServiceAccountJsonProvider {
  public getServiceAccountJson(): string {
    const filePath = resolve(__dirname, '../../serviceAccountKey.json');
    const content = readFileSync(filePath, 'utf-8');

    return JSON.parse(content);
  }
}
