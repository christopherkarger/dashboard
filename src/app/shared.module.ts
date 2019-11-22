import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';


const components = [

];

@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  exports: [...components, CommonModule]
})
export class SharedModule {}
