export const ru = {
  // Error messages
  errors: {
    userNotIdentified: '❌ Не удается идентифицировать пользователя',
    generalError: '❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.',
    calculatorUnavailable: '❌ Невозможно запустить калькулятор. Пожалуйста, попробуйте позже.',
    accessUnavailable: '❌ Невозможно получить доступ к калькулятору. Пожалуйста, попробуйте позже.',
    calculatorError: '❌ Произошла ошибка при запуске калькулятора. Пожалуйста, попробуйте еще раз.',
    fetchReportsError: '❌ Произошла ошибка при получении отчетов. Пожалуйста, попробуйте еще раз.',
    unknownAction: '❌ Неизвестное действие',
    showReportsMenuError: '❌ Произошла ошибка. Пожалуйста, попробуйте еще раз.',
    sendReportError: '❌ Произошла ошибка при отправке отчета. Пожалуйста, попробуйте еще раз.',
    reportNotFound: '❌ Отчет не найден. Пожалуйста, попробуйте еще раз.',
    unknownCommand: '❌ Неизвестная команда. Используйте кнопки меню.'
  },

  // Welcome messages
  welcome: {
    noReports: '🏠 Добро пожаловать в Renovation Helper!\n\nУ вас пока нет отчетов. Нажмите кнопку ниже, чтобы начать расчет стоимости ремонта.',
    withReports: '🏠 Добро пожаловать обратно в Renovation Helper!\n\nУ вас есть {count} отчет(ов). Выберите действие:'
  },

  // Button labels
  buttons: {
    startCalculator: '🧮 Запустить калькулятор',
    startNewCalculator: '🧮 Начать новый расчет',
    viewReports: '📋 Просмотреть отчеты ({count})',
    back: '⬅️ Назад',
    openCalculator: '🧮 Открыть калькулятор',
    calculatorOpening: '🧮 Нажмите кнопку ниже, чтобы открыть калькулятор:',
    navigationHelp: 'Используйте кнопки ниже для навигации:'
  },

  // Reports
  reports: {
    noReports: '📋 У вас пока нет отчетов.',
    listTitle: '📋 Ваши отчеты ({count}):\n\nВыберите отчет для скачивания:',
    reportItem: '{index}. 📄 Отчет от {date}\n   💰 Итого: {amount} {currency}\n\n',
    sendingReport: '📄 Ваш отчет по ремонту'
  }
};