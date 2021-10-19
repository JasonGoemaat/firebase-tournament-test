import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion'
import { MatButtonModule } from "@angular/material/button";

const modules = [
  MatExpansionModule,
  MatButtonModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class AppMaterialModule { }
