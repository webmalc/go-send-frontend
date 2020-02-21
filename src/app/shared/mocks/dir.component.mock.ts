import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dir',
    template: ''
})

export class DirComponentMock {
    @Input() public parent = false;
    @Input() public path: Observable<string>;
}
