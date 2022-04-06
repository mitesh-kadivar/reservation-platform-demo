import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesComponent } from './resources.component';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [{
  path: '',
  component: ResourcesComponent,
  children: [
    {
      path: 'index',
      component: IndexComponent
    },
    {
      path: 'create',
      component: CreateComponent
    },
    {
      path: 'edit/:resourceId',
      component: EditComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }
