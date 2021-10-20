import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpotDialogData } from './spot-dialog-data';

@Component({
  selector: 'app-spot-dialog',
  templateUrl: './spot-dialog.component.html',
  styleUrls: ['./spot-dialog.component.scss']
})
export class SpotDialogComponent implements OnInit {
  animal: string = 'animal';
  name: string = 'name';

  constructor(public dialogRef: MatDialogRef<SpotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SpotDialogData) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
