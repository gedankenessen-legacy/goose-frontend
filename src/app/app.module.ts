import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { de_DE } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthHttpInterceptor } from './AuthHttpInterceptor';
import { UserInfoComponent } from './user-info/user-info.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NotfoundComponent } from './notfound/notfound.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { UserMessagesComponent } from './user-messages/user-messages.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { SharedModule } from './shared/shared.module';
import { MessageItemComponent } from './user-messages/message-item/message-item.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';

registerLocaleData(de);

@NgModule({
  declarations: [
    AppComponent,
    UserInfoComponent,
    NotfoundComponent,
    UserMessagesComponent,
    MessageItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    NzGridModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzResultModule,
    NzAvatarModule,
    NzBadgeModule,
    NzDrawerModule,
    SharedModule,
    NzSpaceModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: de_DE },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
