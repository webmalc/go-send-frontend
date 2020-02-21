import { ClickStopPropagationDirective } from './click-stop-propagation.directive';

describe('ClickStopPropagationDirective', () => {
    it('should stop propagation', () => {
        const directive = new ClickStopPropagationDirective();
        const event = jasmine.createSpyObj('Event', [
            'stopPropagation',
            'preventDefault'
        ]);
        expect(directive).toBeTruthy();
        directive.onClick(event);
        expect(event.stopPropagation).toHaveBeenCalledTimes(1);
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

});
