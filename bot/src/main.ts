import './register-paths';

import type { Step } from '@common';
import { FirebaseService, registerContainer } from '@common';

const x: Step = {
  id: '1',
  type: 'number',
  title: 'What is your name?',
  nextStep: '3',
};

registerContainer(() => {
  //
});

console.log('Hello World', x);

const xx = new FirebaseService();
console.log('x', xx);
