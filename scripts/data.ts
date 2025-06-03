import { OptionList, Step } from '@/common/types';

export const steps: Step[] = [
  {
    id: 'area',
    title: 'Введите площадь помещения (м²):',
    type: 'number',
    nextStep: 'room_state',
  },
  {
    id: 'room_state',
    title: 'Состояние помещения:',
    type: 'select',
    optionsFrom: 'room_states',
    nextStep: 'repair_type',
  },
  {
    id: 'repair_type',
    title: 'Выберите тип ремонта:',
    type: 'select',
    optionsFrom: 'repair_types',
    nextStep: 'demolition',
  },
  {
    id: 'demolition',
    title: 'Нужен демонтаж',
    type: 'boolean',
    nextStep: 'ceiling_material',
  },
  {
    id: 'ceiling_material',
    title: 'Выберите материал для потолка:',
    type: 'select',
    optionsFrom: 'ceiling_materials',
    nextStep: 'walls_material',
  },
  {
    id: 'walls_material',
    title: 'Выберите материал для стен:',
    type: 'select',
    optionsFrom: 'walls_materials',
    nextStep: 'walls_cover',
  },
  {
    id: 'walls_cover',
    title: 'Выберите покрытие для стен:',
    type: 'select',
    optionsFrom: 'walls_covers',
    nextStep: 'floor_material',
  },
  {
    id: 'floor_material',
    title: 'Выберите материал для пола:',
    type: 'select',
    optionsFrom: 'floor_materials',
    nextStep: 'floor_cover_type',
  },
  {
    id: 'floor_cover_type',
    title: 'Укладка "Елочкой"',
    type: 'boolean',
    nextStep: 'plumbing',
  },
  {
    id: 'plumbing',
    title: 'Сантехника',
    type: 'boolean',
    nextStep: 'electro',
  },
  {
    id: 'electro',
    title: 'Электрика',
    type: 'boolean',
    nextStep: 'summary',
  },
  {
    id: 'summary',
    type: 'calc',
    title: '💰 Итоговая стоимость:',
  },
];

export const stepsOptions: Record<string, OptionList> = {
  repair_type: {
    id: 'repair_types',
    options: [
      {
        id: 'repair_economy',
        title: 'Эконом',
        pricePerM2: 3000,
      },
      {
        id: 'repair_standard',
        title: 'Стандарт',
        pricePerM2: 5000,
      },
      {
        id: 'repair_design',
        title: 'Дизайнерский',
        pricePerM2: 8000,
      },
    ],
  },
  room_state: {
    id: 'room_states',
    options: [
      {
        id: 'room_state_with_renovation',
        title: 'Есть ремонт',
        pricePerM2: 3000,
      },
      {
        id: 'room_state_nothing',
        title: 'Черновая отделка',
        pricePerM2: 5000,
      },
      {
        id: 'room_state_blank',
        title: 'Чистовая отделка',
        pricePerM2: 8000,
      },
    ],
  },
  repair_style: {
    id: 'repair_styles',
    options: [
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
    ],
  },
  walls_material: {
    id: 'walls_materials',
    options: [
      {
        id: 'plaster',
        title: 'Штукатурка',
        pricePerM2: 500,
      },
      {
        id: 'gypsum',
        title: 'Гипсокартон',
        pricePerM2: 700,
      },
    ],
  },
  walls_cover: {
    id: 'walls_covers',
    options: [
      {
        id: 'wallpaper',
        title: 'Обои',
        pricePerM2: 500,
      },
      {
        id: 'paint',
        title: 'Покраска',
        pricePerM2: 700,
      },
      {
        id: 'decorative_plaster',
        title: 'Декоративная штукатурка',
        pricePerM2: 900,
      },
    ],
  },
  floor_material: {
    id: 'floor_materials',
    options: [
      {
        id: 'laminate',
        title: 'Ламинат',
        pricePerM2: 1000,
      },
      {
        id: 'quartz_vinyl',
        title: 'Кварцвинил',
        pricePerM2: 1200,
      },
      {
        id: 'parquet',
        title: 'Паркет',
        pricePerM2: 1500,
      },
    ],
  },
  ceiling_material: {
    id: 'ceiling_materials',
    options: [
      {
        id: 'whitewash',
        title: 'Покраска',
        pricePerM2: 400,
      },
      {
        id: 'stretch_ceiling',
        title: 'Натяжной',
        pricePerM2: 900,
      },
      {
        id: 'gypsum_ceiling',
        title: 'Гипсокартон',
        pricePerM2: 1100,
      },
    ],
  },
  addons: {
    id: 'addon_services',
    options: [
      {
        id: 'demolition',
        title: 'Демонтаж перегородок и стен',
        price: 1_500_000,
      },
      {
        id: 'noise_isolation',
        title: 'Шумоизоляция',
        price: 3_000_000,
      },
      {
        id: 'design_project',
        title: 'Дизайн-проект',
        price: 1_200_000,
      },
    ],
  },
};
