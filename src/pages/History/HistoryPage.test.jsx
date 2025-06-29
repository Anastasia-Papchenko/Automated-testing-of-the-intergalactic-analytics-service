import { ClearHistoryButton } from '@components/ClearHistoryButton';
import { GenerateMoreButton } from '@components/GenerateMoreButton';
import { HistoryList } from '@components/HistoryList';
import { HistoryModal } from '@components/HistoryModal';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { HistoryPage } from './HistoryPage';


describe('HistoryPage', () => {
  it('корректно рендерит все дочерние компоненты', () => {
    render(<HistoryPage />);

    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.getByTestId('generate-more-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-history-button')).toBeInTheDocument();
    expect(screen.getByTestId('history-modal')).toBeInTheDocument();
  });

/* ------------------------------------------------------------------ */

  it('передает правильные пропсы в дочерние компоненты', () => {
    render(<HistoryPage />);

    expect(HistoryList).toHaveBeenCalled();
    expect(GenerateMoreButton).toHaveBeenCalled();
    expect(ClearHistoryButton).toHaveBeenCalled();
    expect(HistoryModal).toHaveBeenCalled();
  });
});