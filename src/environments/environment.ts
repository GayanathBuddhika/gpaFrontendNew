// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081',
  baseUrl: 'http://localhost:4200',
  subDomainUrl: '',
  firebase: {
    apiKey: "AIzaSyAk2unwnILhn6LSA9tYvck0AxSy_e2FGgQ",
    authDomain: "pulsebeat-ac9da.firebaseapp.com",
    databaseURL: "https://pulsebeat-ac9da.firebaseio.com",
    projectId: "pulsebeat-ac9da",
    storageBucket: "pulsebeat-ac9da.appspot.com",
    messagingSenderId: "398051117615"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
