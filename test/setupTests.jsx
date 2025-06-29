import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';


vi.stubGlobal('fetch', vi.fn());

vi.stubGlobal('FormData', class {
  append = vi.fn();
});
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn(),
});

vi.stubGlobal('clearHistoryStorage', vi.fn());

vi.mock('@ui/Button', () => ({
  Button: vi.fn(({ children, onClick }) => (
    <button 
      onClick={onClick}
      data-testid="mock-button"
    >
      {children}
    </button>
  )),
}));

vi.mock('@ui/Loader', () => ({
  Loader: vi.fn(() => (
    <div data-testid="mock-loader">Loader...</div>
  )),
}));

vi.mock('@ui/Typography', () => ({
  Typography: vi.fn(({ children, color }) => (
    <div 
      data-testid="mock-typography"
      data-color={color}
    >
      {children}
    </div>
  )),
}));


afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('@components/ClearHistoryButton', () => ({
  ClearHistoryButton: vi.fn(() => <button data-testid="clear-history-button">Clear History</button>),
}));

vi.mock('@components/GenerateMoreButton', () => ({
  GenerateMoreButton: vi.fn(() => <button data-testid="generate-more-button">Generate More</button>),
}));

vi.mock('@components/HistoryList', () => ({
  HistoryList: vi.fn(() => <div data-testid="history-list">History List</div>),
}));

vi.mock('@components/HistoryModal', () => ({
  HistoryModal: vi.fn(() => <div data-testid="history-modal">History Modal</div>),
}));


