import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
    {
        path: '', canActivate: [AuthGuard], children: [
            {
                path: '',
                redirectTo: 'folder/Inbox',
                pathMatch: 'full'
            },
            {
                path: 'folder/:id',
                loadChildren: () => import('./folder/folder.module')
                    .then(m => m.FolderPageModule),
                data: { title: 'browse' }
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module')
            .then(m => m.AuthPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
