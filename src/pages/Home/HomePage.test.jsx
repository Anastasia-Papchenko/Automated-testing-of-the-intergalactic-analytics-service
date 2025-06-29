import { FileUploadSection } from '@components/FileUploadSection';
import { HighlightsSection } from '@components/HighlightsSection';
import { useCsvAnalysis } from '@hooks/use-csv-analysis';
import { useAnalysisStore } from '@store/analysisStore';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Typography } from '@ui/Typography';
import { addToHistory } from '@utils/storage';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { HomePage } from './HomePage';

vi.mock('@hooks/use-csv-analysis');
vi.mock('@store/analysisStore');
vi.mock('@utils/storage');
vi.mock('@components/FileUploadSection');
vi.mock('@components/HighlightsSection');
vi.mock('@ui/Typography');

const mockFile = new File(['content'], 'test.csv', { type: 'text/csv' });

beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useAnalysisStore).mockReturnValue({
        file: null,
        status: 'idle',
        highlights: null,
        error: null,
        setFile: vi.fn(),
        setStatus: vi.fn(),
        setHighlights: vi.fn(),
        reset: vi.fn(),
        setError: vi.fn()
    });

    vi.mocked(useCsvAnalysis).mockReturnValue({
        analyzeCsv: vi.fn()
    });

    vi.mocked(FileUploadSection).mockImplementation(({ onFileSelect, onSend }) => (
        <div data-testid="file-upload-section">
        <button onClick={() => onFileSelect(mockFile)}>Mock Select File</button>
        <button onClick={() => onSend()}>Mock Send</button>
        </div>
    ));

    vi.mocked(HighlightsSection).mockImplementation(() => (
        <div data-testid="highlights-section">Highlights Section</div>
    ));

    vi.mocked(Typography).mockImplementation(({ children }) => (
        <div data-testid="typography">{children}</div>
    ));
});

describe('HomePage', () => {
    it('корректно рендерит заголовок', () => {
        render(<HomePage />);
        expect(screen.getByTestId('typography')).toHaveTextContent(
            'Загрузите csv файл и получите полную информацию о нём за сверхнизкое время'
        );
    });

/* ------------------------------------------------------------------ */

    it('отображает FileUploadSection и HighlightsSection', () => {
        render(<HomePage />);
        expect(screen.getByTestId('file-upload-section')).toBeInTheDocument();
        expect(screen.getByTestId('highlights-section')).toBeInTheDocument();
    });

/* ------------------------------------------------------------------ */

    it('обрабатывает выбор файла', () => {
        const mockSetFile = vi.fn();
        vi.mocked(useAnalysisStore).mockReturnValueOnce({
            ...useAnalysisStore(),
            setFile: mockSetFile
        });

        render(<HomePage />);
        fireEvent.click(screen.getByText('Mock Select File'));
        expect(mockSetFile).toHaveBeenCalledWith(mockFile);
    });

/* ------------------------------------------------------------------ */

    it('обрабатывает отправку файла', async () => {
        const mockAnalyzeCsv = vi.fn().mockResolvedValue(undefined);
        vi.mocked(useCsvAnalysis).mockReturnValueOnce({
            analyzeCsv: mockAnalyzeCsv
        });

        vi.mocked(useAnalysisStore).mockReturnValueOnce({
            ...useAnalysisStore(),
            file: mockFile,
            setStatus: vi.fn()
        });

        render(<HomePage />);
        fireEvent.click(screen.getByText('Mock Send'));
        
        await waitFor(() => {
            expect(mockAnalyzeCsv).toHaveBeenCalledWith(mockFile);
        });
    });

/* ------------------------------------------------------------------ */

    it('не отправляет файл если он не выбран', () => {
        const mockAnalyzeCsv = vi.fn();
        vi.mocked(useCsvAnalysis).mockReturnValueOnce({
            analyzeCsv: mockAnalyzeCsv
        });

        render(<HomePage />);
        fireEvent.click(screen.getByText('Mock Send'));
        expect(mockAnalyzeCsv).not.toHaveBeenCalled();
    });

/* ------------------------------------------------------------------ */

    it('добавляет в историю при успешном анализе', async () => {
        const mockHighlights = { revenue: 1000 };
        
        vi.mocked(useCsvAnalysis).mockImplementation(({ onComplete }) => ({
            analyzeCsv: vi.fn().mockImplementation(async () => {
                onComplete(mockHighlights);
            })
        }));

        vi.mocked(useAnalysisStore).mockReturnValueOnce({
            ...useAnalysisStore(),
            file: mockFile,
            setStatus: vi.fn()
        });

        render(<HomePage />);
        fireEvent.click(screen.getByText('Mock Send'));
        
        await waitFor(() => {
            expect(addToHistory).toHaveBeenCalledWith({
                fileName: 'test.csv',
                highlights: mockHighlights
            });
        });
    });

/* ------------------------------------------------------------------ */

    it('добавляет в историю при ошибке', async () => {
        const mockError = new Error('Test error');
        
        vi.mocked(useCsvAnalysis).mockImplementation(({ onError }) => ({
            analyzeCsv: vi.fn().mockImplementation(async () => {
                onError(mockError);
            })
        }));

        vi.mocked(useAnalysisStore).mockReturnValueOnce({
            ...useAnalysisStore(),
            file: mockFile,
            setStatus: vi.fn(),
            setError: vi.fn()
        });

        render(<HomePage />);
        fireEvent.click(screen.getByText('Mock Send'));
        
        await waitFor(() => {
            expect(addToHistory).toHaveBeenCalledWith({
                fileName: 'test.csv'
            });
        });
    });
});