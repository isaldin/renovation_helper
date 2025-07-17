import { injectable } from 'tsyringe';
import { FirebaseServiceAccountJsonProvider } from '@common';
import { resolve } from 'path';
import { readFileSync } from 'fs';

@injectable()
export class PdfWorkerFirebaseServiceAccountJsonProvider implements FirebaseServiceAccountJsonProvider {
  public getServiceAccountJson(): string {
    // @todo use absolute path from config/env
    const filePath = resolve(__dirname, '../serviceAccountKey.json');
    const content = readFileSync(filePath, 'utf-8');

    return JSON.parse(content);
  }
}
