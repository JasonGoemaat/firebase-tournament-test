import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion'
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';

const modules = [
  MatExpansionModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class AppMaterialModule { }
