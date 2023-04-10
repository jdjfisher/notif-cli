import cli from '../src/notif';
import { describe, test, expect, beforeEach, vi } from 'vitest';

describe('...', () => {
  beforeEach(() => {
    cli.exitOverride();
  });

  test('...', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    cli.parse(['status'], { from: 'user' });

    expect(consoleSpy).toHaveBeenCalledWith('not linked');
  });
});
