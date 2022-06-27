// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const ipAddress = '192.168.1.185';
   
export const environment = {
  production: true,
  apiRestUrl: 'http://' + ipAddress + ':8102/',
  nodeApiRestUrl: 'http://' + ipAddress + ':8000/',
  webSocketUrl: 'ws:/' + ipAddress + ':7104/events/vehicle/verification',  
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
