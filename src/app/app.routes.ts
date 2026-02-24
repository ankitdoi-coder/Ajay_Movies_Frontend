import { Routes } from '@angular/router';
import { Home } from './home/home';
import { DownloadPageComponent } from './download-page/download-page';
import { Admin } from './admin/admin';
import { AdminLogin } from './admin-login/admin-login';
import { AuthGuard } from './Guards/auth.guard';
import { Contactus } from './contactus/contactus';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'download/:id', component: DownloadPageComponent },
    { path: 'admin-login', component: AdminLogin },
    { path: 'admin', component: Admin, canActivate: [AuthGuard] },
    { path: 'contactus', component: Contactus },
    { path: '**', redirectTo: '' }
];
