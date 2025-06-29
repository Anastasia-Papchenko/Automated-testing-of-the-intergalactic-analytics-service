import { HIGHLIGHT_TITLES } from '@utils/consts';
import { describe, it, expect } from 'vitest';

import {
    transformAnalysisData,
    convertHighlightsToArray,
    isCsvFile,
    validateServerResponse,
    InvalidServerResponseError
} from './analysis';



describe('Analysis Module', () => {
    describe('transformAnalysisData', () => {
        it('должен выбрасывать InvalidServerResponseError при невалидном ответе сервера', () => {
            const invalidData = { some_key: null };
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(JSON.stringify(invalidData) + '\n');

            expect(() => transformAnalysisData(encodedData)).toThrowError(
                InvalidServerResponseError
            );
        });

/* ------------------------------------------------------------------ */

        it('должен выбрасывать ошибку при отсутствии валидных ключей', () => {
            const invalidData = { invalid_key: 'value' };
            const encoder = new TextEncoder();
            const encodedData = encoder.encode(JSON.stringify(invalidData) + '\n');

            expect(() => transformAnalysisData(encodedData)).toThrowError(
                InvalidServerResponseError
            );
        });
    });

/* ------------------------------------------------------------------ */

    describe('convertHighlightsToArray', () => {
        it('должен преобразовывать объект highlights в массив AnalysisHighlight', () => {
            const highlights = {
                revenue: 1000,
                profit: 500,
                unknown_key: 'value'
            };

            const result = convertHighlightsToArray(highlights);

            expect(result).toEqual([
                {
                    title: '1000',
                    description: HIGHLIGHT_TITLES.revenue || 'Неизвестный параметр'
                },
                {
                    title: '500',
                    description: HIGHLIGHT_TITLES.profit || 'Неизвестный параметр'
                },
                {
                    title: 'value',
                    description: 'Неизвестный параметр'
                }
            ]);
        });

/* ------------------------------------------------------------------ */

        it('должен округлять числовые значения', () => {
            const highlights = {
                revenue: 1000.456,
                profit: 500.789
            };

            const result = convertHighlightsToArray(highlights);

            expect(result).toEqual([
                {
                    title: '1000',
                    description: HIGHLIGHT_TITLES.revenue || 'Неизвестный параметр'
                },
                {
                    title: '501',
                    description: HIGHLIGHT_TITLES.profit || 'Неизвестный параметр'
                }
            ]);
        });

/* ------------------------------------------------------------------ */

        it('должен обрабатывать пустой объект', () => {
            const highlights = {};
            const result = convertHighlightsToArray(highlights);
            expect(result).toEqual([]);
        });
    });

/* ------------------------------------------------------------------ */

    describe('isCsvFile', () => {
        it('должен возвращать true для .csv файлов', () => {
            const file = new File([''], 'test.csv', { type: 'text/csv' });
            expect(isCsvFile(file)).toBe(true);
        });

/* ------------------------------------------------------------------ */

        it('должен возвращать false для не-csv файлов', () => {
            const file = new File([''], 'test.txt', { type: 'text/plain' });
            expect(isCsvFile(file)).toBe(false);
        });

/* ------------------------------------------------------------------ */

        it('должен быть нечувствительным к регистр', () => {
            const file = new File([''], 'TEST.CSV', { type: 'text/csv' });
            expect(isCsvFile(file)).toBe(true);
        });
    });

/* ------------------------------------------------------------------ */

    describe('validateServerResponse', () => {
        it('должен возвращать true для валидного ответа с известными ключами', () => {
            const validKeys = Object.keys(HIGHLIGHT_TITLES);
            const testData = {};
            validKeys.forEach(key => {
                testData[key] = 'some value';
            });

            expect(validateServerResponse(testData)).toBe(true);
        });

/* ------------------------------------------------------------------ */

        it('должен возвращать false для ответа без известных ключей', () => {
            const testData = {
                unknown_key: 'value',
                another_unknown: 123
            };

            expect(validateServerResponse(testData)).toBe(false);
        });

/* ------------------------------------------------------------------ */

        it('должен выбрасывать InvalidServerResponseError при null значениях', () => {
            const validKeys = Object.keys(HIGHLIGHT_TITLES);
            const testData = {};
            
            
            validKeys.forEach((key, index) => {
                testData[key] = index === 0 ? null : 'valid value';
            });

            expect(() => validateServerResponse(testData)).toThrowError(
                InvalidServerResponseError
            );
        });

/* ------------------------------------------------------------------ */

        it('должен возвращать true если присутствует хотя бы один известный ключ', () => {
            const validKeys = Object.keys(HIGHLIGHT_TITLES);
            const testData = {
                [validKeys[0]]: 1000, 
                unknown_key: 'value'
            };

            expect(validateServerResponse(testData)).toBe(true);
        });
    });

/* ------------------------------------------------------------------ */

    describe('InvalidServerResponseError', () => {
        it('должен создавать экземпляр с правильным именем и сообщением', () => {
            const error = new InvalidServerResponseError('Test error');
            expect(error.name).toBe('InvalidServerResponseError');
            expect(error.message).toBe('Test error');
        });
    });
});