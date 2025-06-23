import 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Calculator, CalculatorSettings } from '@/common/types';
import { steps, stepsOptions as options } from './data';
import { subSteps } from './substep';
import serviceAccountKey from './serviceAccountKey.json';

initializeApp({
  credential: cert(serviceAccountKey as any),
});
const store = getFirestore();

export const createCalculator = async (version: string) => {
  const basePath = `calculator`;

  const calc: Omit<Calculator, 'id' | 'settings' | 'steps' | 'subSteps' | 'optionList' | 'companyId'> = {
    version,
  };

  const calcRef = await store.collection(basePath).add(calc);

  const calculatorId = calcRef.id;

  const settings: Omit<CalculatorSettings, 'id'> = {
    calculatorId,
    name: 'Калькулятор ремонта',
    language: 'ru',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await store.collection(`${basePath}/${calculatorId}/settings`).add(settings);
  // await addDoc(collection(store, `${basePath}/${calculatorId}/settings`), settings);

  // steps
  for (const step of steps) {
    await store.collection(`${basePath}/${calculatorId}/steps`).add(step);
    // await addDoc(collection(store, `${basePath}/${calculatorId}/steps`), step);
  }

  // options
  for (const list of Object.values(options)) {
    await store.collection(`${basePath}/${calculatorId}/options`).add(list);
    // await addDoc(collection(store, `${basePath}/${calculatorId}/options`), list);
  }

  // substeps
  for (const subStep of subSteps) {
    await store.collection(`${basePath}/${calculatorId}/substeps`).add(subStep);
    // await addDoc(collection(store, `${basePath}/${calculatorId}/substeps`), subStep);
  }

  console.log(`✅ Calculator created for with version ${version}`);
};

createCalculator('1').catch(console.error);
