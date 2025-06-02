import { SubStep } from '@/common/types';

export const subSteps: SubStep[] = [
  {
    id: 'repair_styles',
    sourceStepId: 'repair_type',
    choiceFromSource: 'repair_design',
    type: 'select',
    title: 'Стиль ремонта',
    defaultValue: 'repair_styles_unknown',
    optionItems: [
      {
        id: 'repair_styles_american_classic',
        title: 'Американский классический',
        pricePerM2: 1000,
      },
      {
        id: 'repair_styles_fusion',
        title: 'Фьюжн',
        pricePerM2: 1100,
      },
      {
        id: 'repair_styles_loft',
        title: 'Лофт',
        pricePerM2: 1200,
      },
      {
        id: 'repair_styles_scandi',
        title: 'Скандинавский',
        pricePerM2: 1300,
      },
      {
        id: 'repair_styles_unknown',
        title: 'Затрудняюсь ответить',
        pricePerM2: 0,
      },
    ],
  },
  {
    id: 'shadow_ceiling',
    sourceStepId: 'ceiling_material',
    choiceFromSource: ['stretch_ceiling', 'gypsum_ceiling'],
    type: 'boolean',
    title: 'Теневой полоток',
  },
];
