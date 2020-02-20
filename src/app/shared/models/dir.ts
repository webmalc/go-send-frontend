import { Expose } from 'class-transformer';

// The dir class
export class Dir {
    public path: string;

    @Expose({ name: 'relative_path' })
    public relativePath: string;

    public hash: string;

    public url: string;

    public loading = false;

    public getRoute(): string {
        return '/folder/' + this.relativePath.replace(/\//g, '**');
    }
}
