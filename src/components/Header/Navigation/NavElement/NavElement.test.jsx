import { render, screen } from '@testing-library/react';
import { MemoryRouter, NavLink  } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NavElement } from './NavElement';

vi.mock('@ui/Typography', () => ({
    Typography: vi.fn(({ children }) => <span data-testid="typography">{children}</span>)
}));

vi.mock('react-router-dom', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        NavLink: vi.fn().mockImplementation(({ children, className, to, end }) => (
        <a 
            href={to} 
            className={className?.({ isActive: false })}
            data-end={end}
            data-testid="nav-link"
        >
            {children}
        </a>
        ))
    };
});

describe('NavElement', () => {
    const mockIcon = <svg data-testid="mock-icon" />;
    const baseProps = {
        to: '/home',
        title: 'Home',
        icon: mockIcon
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('корректно рендерится с переданными пропсами', () => {
        render(
        <MemoryRouter>
            <NavElement {...baseProps} />
        </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
        expect(screen.getByTestId('typography')).toHaveTextContent('Home');
    });

/* ------------------------------------------------------------------ */

    it('передает правильные параметры в NavLink', () => {
        render(
        <MemoryRouter>
            <NavElement {...baseProps} end={true} />
        </MemoryRouter>
        );

        const navLinkProps = vi.mocked(NavLink).mock.calls[0][0];
        expect(navLinkProps.to).toBe('/home');
        expect(navLinkProps.end).toBe(true);
        expect(typeof navLinkProps.className).toBe('function');
    });

/* ------------------------------------------------------------------ */

    it('использует end=false по умолчанию', () => {
        render(
        <MemoryRouter>
            <NavElement {...baseProps} />
        </MemoryRouter>
        );

        const navLinkProps = vi.mocked(NavLink).mock.calls[0][0];
        expect(navLinkProps.end).toBe(false);
    });

/* ------------------------------------------------------------------ */

    it('использует переданное значение end', () => {
        render(
        <MemoryRouter>
            <NavElement {...baseProps} end={true} />
        </MemoryRouter>
        );

        const navLinkProps = vi.mocked(NavLink).mock.calls[0][0];
        expect(navLinkProps.end).toBe(true);
    });
});