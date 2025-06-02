import type { Step } from '@/common';

const x: Step = {
  id: '1',
  type: 'number',
  title: 'What is your name?',
  multiple: true,
  optionsFrom: '2',
  nextStep: '3',
};

console.log('Hello World', x);
