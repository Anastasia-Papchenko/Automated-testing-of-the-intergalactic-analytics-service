# Автоматизированное тестирование Межгалактического аналитического сервиса

Данный репозиторий содержит набор автоматических тестов для фронтенда Межгалактического аналитического сервиса, разработанного на React и настроенного для запуска в Vitest.

## Обзор

Тестирование реализовано в соответствии с функциональными требованиями к приложению:

- **Загрузка таблиц с данными и получение аналитики**
- **Отображение прогресса обработки (по требованию пользователей)**
- **Генератор тестовых данных для проверки системы**
- **История загрузок (ключевой запрос от клиентов), хранимая в LocalStorage**
- **Навигационное меню для перемещения между разделами**

## Технологии

- **Фронтенд**: React
- **Системы тестирования**: Vitest
- **Библиотеки и утилиты**:
  - @testing-library/react
  - @testing-library/jest-dom
  - vitest
- **Сборщик**: Vite

## Тесты

Список всех файлов с тестами:
- src/pages/Generate/GeneratePage.test.jsx (4 tests) 
- src/components/Header/Navigation/NavElement/NavElement.test.jsx (4 tests) 
- src/components/Header/Navigation/Navigation.test.jsx (2 tests)
- src/pages/Home/HomePage.test.jsx (7 tests)
- src/hooks/use-debounce.test.jsx (5 tests)
- src/pages/History/HistoryPage.test.jsx (2 tests)
- src/hooks/use-csv-analysis.test.jsx (6 tests)
- src/utils/storage.test.jsx (9 tests) 
- src/utils/formateDate.test.jsx (6 tests)  
- src/utils/analysis.test.jsx (13 tests) 

Глобальные компоненты:
- test/setupTests.jsx

## Установка и запуск



   ```
    git clone https://github.com/Anastasia-Papchenko/Automated-testing-of-the-intergalactic-analytics-service.git
    cd Automated-testing-of-the-intergalactic-analytics-service
    npm i
    npm run dev  # для запуска проекта
    npm run test # для запуска тестов
    npm run test:coverage # для просмотра покрытия по всему проекту
```

- Для полного запуска проекла нужно установить **[Бэкенд](https://github.com/etozhenerk/shri2025-back)**