import cli from '../src/notif';

describe('...', () => {
    beforeEach(() => {
        cli.exitOverride();
    });

    test('...', () => {
        const consoleSpy = jest.spyOn(console, 'log');
    
        cli.parse(['status'], { from: 'user' });
    
        expect(consoleSpy).toHaveBeenCalledWith('not linked');
    });
});

