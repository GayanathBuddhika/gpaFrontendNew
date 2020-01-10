import { NotificationComponent } from './component/notification/notification.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { GaugeSurveyComponent } from './component/gauge-survey/gauge-survey.component';
import { ErrorPageComponent } from './component/error-page/error-page.component';

const routes: Routes = [
 // { path: "", redirectTo: "signin", pathMatch: "full" },
  // {
  //   path: "main",
  //   loadChildren: "./component/main-components.module#MainComponentModule"
  // },
  // { path: "", loadChildren: "./component/auth/auth.module#AuthModule" },
  {
    path: "main",
    loadChildren: "./component/main-components.module#MainComponentModule"
  },
  { path: "gaugesurvey", component:GaugeSurveyComponent},
  { path: "errorpage", component:ErrorPageComponent},
//   {path: '404', component: PageNotFoundComponent},
//   {path: '**', redirectTo: '/404'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
