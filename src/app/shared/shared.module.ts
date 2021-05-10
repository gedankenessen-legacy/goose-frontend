import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, NzAvatarModule],
  exports: [AvatarComponent],
})
export class SharedModule {}
