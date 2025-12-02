describe('Global vi check', () => {
    it('should have vi defined', () => {
        expect(vi).toBeDefined();
        const spy = vi.fn();
        spy();
        expect(spy).toHaveBeenCalled();
    });
});
