import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        return setTimeout(cb, 16);
        });
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

/* ------------------------------------------------------------------ */

    it('должен использовать requestAnimationFrame по умолчанию', () => {
        const mockFn = vi.fn();
        const { result } = renderHook(() => useDebounce(mockFn));
        act(() => {
            result.current('test');
        });
        expect(mockFn).not.toHaveBeenCalled();
        expect(window.requestAnimationFrame).toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(16);
        });
        expect(mockFn).toHaveBeenCalledWith('test');
    });

/* ------------------------------------------------------------------ */

    it('должен использовать setTimeout с заданной задержкой', () => {
        const delay = 100;
        const mockFn = vi.fn();
        const { result } = renderHook(() => useDebounce(mockFn, { type: 'timeout', delay }));
        act(() => {
            result.current('test');
        });
        expect(mockFn).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(delay - 1);
        });
        expect(mockFn).not.toHaveBeenCalled();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(mockFn).toHaveBeenCalledWith('test');
    });

/* ------------------------------------------------------------------ */

    it('должен очищать таймеры при unmount', () => {
        const delay = 100;
        const mockFn = vi.fn();
        const { result, unmount } = renderHook(() => 
            useDebounce(mockFn, { type: 'timeout', delay })
        );
        act(() => {
            result.current('test');
        });
        vi.runAllTimers();
        unmount();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith('test');
    });

/* ------------------------------------------------------------------ */

    it('должен передавать правильные аргументы', () => {
        const mockFn = vi.fn();
        const { result } = renderHook(() => useDebounce(mockFn));
        act(() => {
            result.current(1, 'two', { three: 3 });
        });
        act(() => {
            vi.advanceTimersByTime(16);
        });
        expect(mockFn).toHaveBeenCalledWith(1, 'two', { three: 3 });
    });

/* ------------------------------------------------------------------ */

    it('должен обрабатывать несколько вызовов последовательно', () => {
        const mockFn = vi.fn();
        const { result } = renderHook(() => useDebounce(mockFn, { type: 'timeout', delay: 50 }));
        act(() => {
            result.current('call1');
        });
        act(() => {
            vi.advanceTimersByTime(50);
            result.current('call2');
            vi.advanceTimersByTime(50);
        });
        expect(mockFn).toHaveBeenCalledTimes(2);
        expect(mockFn).toHaveBeenNthCalledWith(1, 'call1');
        expect(mockFn).toHaveBeenNthCalledWith(2, 'call2');
    });
});