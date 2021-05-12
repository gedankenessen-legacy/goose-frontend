import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AvatarPipe } from './avatar/avatar.pipe';

@NgModule({
  declarations: [AvatarComponent, AvatarPipe],
  imports: [CommonModule, NzAvatarModule],
  exports: [AvatarComponent, AvatarPipe],
})
export class SharedModule { }
