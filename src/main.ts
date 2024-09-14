import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import {
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { tap } from 'rxjs';

function loggingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  console.log('Request:', request);
  // const req = request.clone({
  //   headers: request.headers.set('X-DEBUG', 'TESTING')
  // })
  return next(request).pipe(
    tap({
      next: (response) => {
        if (response.type === HttpEventType.Response){
          console.log('Response status:', response.status);
          console.log('Response body:', response.body)
        }
      },
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor]))],
}).catch((err) => console.error(err));
