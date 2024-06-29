import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
