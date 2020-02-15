import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    folder: string;

    constructor(private readonly activatedRoute: ActivatedRoute) { }


    ngOnInit(): void {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    }

}
