import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCapW27zHhuhKwLfMhfKWfTLzulyLWLKTU',
        authDomain: 'kilo-jul.firebaseapp.com',
        projectId: 'kilo-jul',
        storageBucket: 'kilo-jul.appspot.com',
        messagingSenderId: '898768832261',
        appId: '1:898768832261:web:4e3ce20712a8d0ce08596c',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
