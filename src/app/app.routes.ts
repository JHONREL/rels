import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MyLogsComponent } from './my-logs/my-logs.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { AddPostComponent } from './add-post/add-post.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { EditPostComponent } from './edit-post/edit-post.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'logs/:userid', component: MyLogsComponent },
  { path: 'view-post/:postid', component: ViewPostComponent },
  { path: 'add-post', component: AddPostComponent },
  { path: 'edit-post/:postid', component: EditPostComponent },
];
