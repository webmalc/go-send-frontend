import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@core/services/title.service';

@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    public folder: string;

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly titleService: TitleService,
    ) { }


    public ngOnInit(): void {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
        this.titleService.setTitle(this.folder);
    }

}
