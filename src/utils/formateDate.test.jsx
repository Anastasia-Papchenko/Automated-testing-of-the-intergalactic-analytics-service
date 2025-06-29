import { describe, it, expect } from 'vitest';

import { formatDate } from './formateDate';

describe('Функция formatDate', () => {
    it('корректно форматирует дату из timestamp', () => {
        const timestamp = 1672531200000; // 1 января 2023
        expect(formatDate(timestamp)).toBe('01.01.2023');
    });

/* ------------------------------------------------------------------ */

    it('корректно форматирует дату из объекта Date', () => {
        const date = new Date(2023, 11, 31); // 31 декабря 2023
        expect(formatDate(date)).toBe('31.12.2023');
    });

/* ------------------------------------------------------------------ */

    it('добавляет ведущие нули для дней и месяцев', () => {
        const date = new Date(2023, 0, 5); // 5 января 2023
        expect(formatDate(date)).toBe('05.01.2023');
    });

/* ------------------------------------------------------------------ */

    it('корректно обрабатывает високосные года', () => {
        const date = new Date(2020, 1, 29); // 29 февраля 2020
        expect(formatDate(date)).toBe('29.02.2020');
    });

/* ------------------------------------------------------------------ */

    it('корректно форматирует минимальную дату', () => {
        const date = new Date(0); // 1 января 1970 (начало Unix эпохи)
        expect(formatDate(date)).toBe('01.01.1970');
    });

/* ------------------------------------------------------------------ */

    it('корректно форматирует текущую дату', () => {
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        
        expect(formatDate(now)).toBe(`${day}.${month}.${year}`);
    });

});