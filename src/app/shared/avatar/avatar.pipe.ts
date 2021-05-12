import { Pipe, PipeTransform } from '@angular/core';
import * as Identicons from 'identicon.js';

@Pipe({
  name: 'avatar',
})
export class AvatarPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return `data:image/png;base64,${new Identicons(value, 420).toString()}`;
  }
}
