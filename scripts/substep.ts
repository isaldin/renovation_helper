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
        images: [
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Famerican_1.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Famerican_2.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Famerican_3.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Famerican_4.jpeg?alt=media',
        ],
      },
      {
        id: 'repair_styles_fusion',
        title: 'Фьюжн',
        pricePerM2: 1100,
        images: [
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Ffusion_1.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Ffusion_2.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Ffusion_3.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Ffusion_4.jpeg?alt=media',
        ],
      },
      {
        id: 'repair_styles_loft',
        title: 'Лофт',
        pricePerM2: 1200,
        images: [
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Floft_1.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Floft_2.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Floft_3.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Floft_4.jpeg?alt=media',
        ],
      },
      {
        id: 'repair_styles_scandi',
        title: 'Скандинавский',
        pricePerM2: 1300,
        images: [
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Fscandi_1.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Fscandi_2.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Fscandi_3.jpeg?alt=media',
          'https://firebasestorage.googleapis.com/v0/b/renovation-helper.firebasestorage.app/o/renovation_styles%2Fscandi_4.jpeg?alt=media',
        ],
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
