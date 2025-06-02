import 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import type { Calculator, CalculatorSettings } from '@/common/types';
import { steps, stepsOptions as options } from './data';
import { subSteps } from './substep';

console.log('Firebase config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
const store = getFirestore(app);

export const createCalculator = async (companyId: string, version: string) => {
  const basePath = `companies/${companyId}/calculator`;

  const calc: Omit<Calculator, 'id' | 'settings' | 'steps' | 'optionList'> = {
    version,
    companyId,
  };

  const ref = collection(store, basePath);
  const calcRef = await addDoc(ref, calc);

  const calculatorId = calcRef.id;

  const settings: Omit<CalculatorSettings, 'id'> = {
    calculatorId,
    name: 'Калькулятор ремонта',
    language: 'ru',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await addDoc(collection(store, `${basePath}/${calculatorId}/settings`), settings);

  // steps
  for (const step of steps) {
    await addDoc(collection(store, `${basePath}/${calculatorId}/steps`), step);
  }

  // options
  for (const list of Object.values(options)) {
    await addDoc(collection(store, `${basePath}/${calculatorId}/options`), list);
  }

  // substeps
  for (const subStep of subSteps) {
    await addDoc(collection(store, `${basePath}/${calculatorId}/substeps`), subStep);
  }

  console.log(`✅ Calculator created for ${companyId}, version ${version}`);
};

createCalculator('c1', '1').catch(console.error);
