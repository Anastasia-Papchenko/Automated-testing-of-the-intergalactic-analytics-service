import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { STORAGE_KEY } from './consts';
import { 
    getHistory, 
    addToHistory, 
    removeFromHistory, 
    clearHistory 
} from './storage';


const localStorageMock = (() => {
    let store = {};

    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

const cryptoMock = {
    randomUUID: vi.fn(() => 'mock-uuid-123'),
};

beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('crypto', cryptoMock);
    localStorageMock.clear();
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('storage module', () => {
    describe('getHistory', () => {
        it('возвращает пустой массив, если в хранилище ничего нет', () => {
            const result = getHistory();
            expect(result).toEqual([]);
            expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
        });

        it('возвращает массив элементов, если они есть в хранилище', () => {
            const mockHistory = [
                { id: '1', timestamp: 123, name: 'Test 1', type: 'analysis' },
                { id: '2', timestamp: 456, name: 'Test 2', type: 'analysis' },
            ];
            localStorageMock.setItem(STORAGE_KEY, JSON.stringify(mockHistory));

            const result = getHistory();
            expect(result).toEqual(mockHistory);
        });

/* ------------------------------------------------------------------ */

        it('возвращает пустой массив при ошибке парсинга', () => {
            localStorageMock.setItem(STORAGE_KEY, 'invalid-json');

            const result = getHistory();
            expect(result).toEqual([]);
        });
    });

/* ------------------------------------------------------------------ */

    describe('addToHistory', () => {
        it('добавляет новый элемент в историю с UUID и timestamp', () => {
            const newItem = { name: 'New Item', type: 'analysis' };
            const result = addToHistory(newItem);

            expect(result).toEqual({
                ...newItem,
                id: 'mock-uuid-123',
                timestamp: expect.any(Number),
            });

            expect(localStorage.setItem).toHaveBeenCalled();
            const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
            expect(savedData).toHaveLength(1);
            expect(savedData[0]).toEqual(result);
        });

/* ------------------------------------------------------------------ */

        it('добавляет новый элемент в начало массива', () => {
            const existingItem = { id: '1', timestamp: 123, name: 'Existing', type: 'analysis' };
            localStorageMock.setItem(STORAGE_KEY, JSON.stringify([existingItem]));

            const newItem = { name: 'New Item', type: 'analysis' };
            addToHistory(newItem);

            const savedData = JSON.parse(localStorageMock.setItem.mock.calls[1][1]);
            expect(savedData).toHaveLength(2);
            expect(savedData[0].name).toBe('New Item');
        });

/* ------------------------------------------------------------------ */

        it('выбрасывает ошибку при неудачной записи', () => {
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('Storage failed');
            });

            const newItem = { name: 'New Item', type: 'analysis' };
            expect(() => addToHistory(newItem)).toThrow('Storage failed');
        });
    });

/* ------------------------------------------------------------------ */

    describe('removeFromHistory', () => {
        beforeEach(() => {
            vi.clearAllMocks();

            const items = [
                { id: '1', timestamp: 123, name: 'Item 1', type: 'analysis' },
                { id: '2', timestamp: 456, name: 'Item 2', type: 'analysis' },
            ];
            localStorageMock.setItem(STORAGE_KEY, JSON.stringify(items));
        });
        it('выбрасывает ошибку при неудачном удалении', () => {
            localStorageMock.setItem.mockImplementationOnce(() => {
                throw new Error('Storage failed');
            });

            expect(() => removeFromHistory('1')).toThrow('Storage failed');
        });
    });

/* ------------------------------------------------------------------ */

    describe('clearHistory', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('очищает хранилище', () => {
            localStorageMock.setItem(STORAGE_KEY, JSON.stringify([
                { id: '1', timestamp: 123, name: 'Item', type: 'analysis' },
            ]));

            clearHistory();

            expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
        });

/* ------------------------------------------------------------------ */        

        it('выбрасывает ошибку при неудачной очистке', () => {
            localStorageMock.removeItem.mockImplementationOnce(() => {
                throw new Error('Storage failed');
            });

            expect(() => clearHistory()).toThrow('Storage failed');
        });
    })
});