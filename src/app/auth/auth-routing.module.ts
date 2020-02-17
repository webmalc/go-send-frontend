import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPage } from './auth.page';


const routes: Routes = [
    {
        path: 'login',
        component: AuthPage,
        data: { title: 'login' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthPageRoutingModule { }
