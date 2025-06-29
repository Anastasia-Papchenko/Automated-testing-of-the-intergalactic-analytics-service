import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { GeneratePage } from './GeneratePage';


describe('GeneratePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('отображает заголовок и кнопку генерации', () => {
        render(<GeneratePage />);
        
        expect(screen.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')).toBeInTheDocument();
        expect(screen.getByText('Начать генерацию')).toBeInTheDocument();
    });

/* ------------------------------------------------------------------ */

    it('показывает лоадер во время генерации', async () => {
        render(<GeneratePage />);
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: vi.fn().mockReturnValue('attachment; filename="report.csv"'),
            },
            blob: vi.fn().mockResolvedValue(new Blob()),
        });

        fireEvent.click(screen.getByText('Начать генерацию'));
        
        await waitFor(() => {
            expect(screen.getByText('Loader...')).toBeInTheDocument();
        });
    });

/* ------------------------------------------------------------------ */

    it('успешно генерирует отчет и показывает сообщение', async () => {
        render(<GeneratePage />);
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            headers: {
                get: vi.fn().mockReturnValue('attachment; filename="report.csv"'),
            },
            blob: vi.fn().mockResolvedValue(new Blob()),
        });

        fireEvent.click(screen.getByText('Начать генерацию'));
        
        await waitFor(() => {
            expect(screen.getByText('Отчёт успешно сгенерирован!')).toBeInTheDocument();
        });
    });

/* ------------------------------------------------------------------ */

    it('обрабатывает ошибку при генерации отчета', async () => {
        render(<GeneratePage />);
        
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: vi.fn().mockResolvedValue({ error: 'Server error' }),
        });

        fireEvent.click(screen.getByText('Начать генерацию'));
        
        await waitFor(() => {
            expect(screen.getByText('Произошла ошибка: Server error')).toBeInTheDocument();
        });
    });

});