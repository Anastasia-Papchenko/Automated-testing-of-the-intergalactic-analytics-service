import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { Navigation } from './Navigation';


vi.mock('@ui/icons/Upload', () => ({
  default: vi.fn(() => <svg data-testid="upload-icon" />),
  Upload: vi.fn(() => <svg data-testid="upload-icon" />)
}));

vi.mock('@ui/icons/Create', () => ({
  default: vi.fn(() => <svg data-testid="create-icon" />),
  Create: vi.fn(() => <svg data-testid="create-icon" />)
}));

vi.mock('@ui/icons/History', () => ({
  default: vi.fn(() => <svg data-testid="history-icon" />),
  History: vi.fn(() => <svg data-testid="history-icon" />)
}));

vi.mock('./NavElement', () => ({
  NavElement: vi.fn((props) => (
    <div data-testid="nav-element" {...props}>
      {props.icon}
      {props.title}
    </div>
  ))
}));

describe('Navigation', () => {
  it('корректно рендерит навигационное меню', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const navElements = screen.getAllByTestId('nav-element');
    expect(navElements).toHaveLength(3);
  });

/* ------------------------------------------------------------------ */

  it('содержит правильные навигационные элементы', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    const navElements = screen.getAllByTestId('nav-element');
    expect(navElements[0]).toHaveTextContent('CSV Аналитик');
    expect(navElements[1]).toHaveTextContent('CSV Генератор');
    expect(navElements[2]).toHaveTextContent('История');

    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    expect(screen.getByTestId('create-icon')).toBeInTheDocument();
    expect(screen.getByTestId('history-icon')).toBeInTheDocument();
  });
});