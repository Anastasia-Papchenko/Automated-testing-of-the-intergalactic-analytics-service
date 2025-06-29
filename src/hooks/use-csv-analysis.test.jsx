import { renderHook, act } from '@testing-library/react';
import { InvalidServerResponseError } from '@utils/analysis';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { useCsvAnalysis } from './use-csv-analysis';


vi.mock('@utils/analysis', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        transformAnalysisData: vi.fn(),
    };
});

vi.mock('@utils/consts', () => ({
    API_HOST: 'http://test-api.com',
}));


describe('useCsvAnalysis', () => {
    const mockOnData = vi.fn();
    const mockOnError = vi.fn();
    const mockOnComplete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

/* ------------------------------------------------------------------ */

    it('должен вызывать fetch с правильными параметрами', async () => {
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
            })
        );
        const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
        await act(async () => {
            await result.current.analyzeCsv(mockFile);
        });
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-api.com/aggregate?rows=10000',
        {
            method: 'POST',
            body: expect.any(FormData),
        }
        );
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать успешный ответ от сервера', async () => {
        const mockReader = {
        read: vi.fn()
            .mockResolvedValueOnce({
                done: false,
                value: new Uint8Array([1, 2, 3]),
            })
            .mockResolvedValueOnce({
                done: true,
            }),
        };
        const mockResponse = {
            ok: true,
            body: {
                getReader: vi.fn().mockReturnValue(mockReader),
            },
        };
        global.fetch.mockResolvedValue(mockResponse);
        const { transformAnalysisData } = await import('@utils/analysis');
        transformAnalysisData.mockReturnValue({
            highlights: { test: 'highlights' },
            highlightsToStore: [{ id: 1, value: 'test' }],
        });
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
            })
        );
        await act(async () => {
            await result.current.analyzeCsv(new File([], 'test.csv'));
        });
        expect(mockOnData).toHaveBeenCalledWith([{ id: 1, value: 'test' }]);
        expect(mockOnComplete).toHaveBeenCalledWith({ test: 'highlights' });
        expect(mockOnError).not.toHaveBeenCalled();
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать ошибку при пустом ответе', async () => {
        const mockResponse = {
            ok: true,
            body: null,
        };
        global.fetch.mockResolvedValue(mockResponse);
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
            })
        );
        await act(async () => {
            await result.current.analyzeCsv(new File([], 'test.csv'));
        });
        expect(mockOnError).toHaveBeenCalledWith(
            new Error('Неизвестная ошибка парсинга :(')
        );
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать HTTP ошибки', async () => {
        const mockResponse = {
            ok: false,
            body: {
                getReader: vi.fn(),
            },
        };
        global.fetch.mockResolvedValue(mockResponse);
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
        })
        );
        await act(async () => {
            await result.current.analyzeCsv(new File([], 'test.csv'));
        });
        expect(mockOnError).toHaveBeenCalledWith(
            new Error('Неизвестная ошибка парсинга :(')
        );
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать InvalidServerResponseError', async () => {
        const mockReader = {
            read: vi.fn().mockRejectedValue(
                new InvalidServerResponseError('Invalid response')
            ),
        };
        const mockResponse = {
            ok: true,
            body: {
                getReader: vi.fn().mockReturnValue(mockReader),
            },
        };
        global.fetch.mockResolvedValue(mockResponse);
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
            })
        );
        await act(async () => {
            await result.current.analyzeCsv(new File([], 'test.csv'));
        });
        expect(mockOnError).toHaveBeenCalledWith(
            expect.any(InvalidServerResponseError)
        );
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать неизвестные ошибки', async () => {
        const mockReader = {
            read: vi.fn().mockRejectedValue(new Error('Unknown error')),
        };
        const mockResponse = {
            ok: true,
            body: {
                getReader: vi.fn().mockReturnValue(mockReader),
            },
        };
        global.fetch.mockResolvedValue(mockResponse);
        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onError: mockOnError,
                onComplete: mockOnComplete,
            })
        );
        await act(async () => {
            await result.current.analyzeCsv(new File([], 'test.csv'));
        });
        expect(mockOnError).toHaveBeenCalledWith(
            new Error('Неизвестная ошибка парсинга :(')
        );
        expect(mockOnComplete).not.toHaveBeenCalled();
    });
});