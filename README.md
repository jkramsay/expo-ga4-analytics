Very limited GA4 version of https://github.com/betaacid/expo-analytics

The intent was to update the calls from expo-analytics to support the GA4 measurements endpoints, but after a naive look at the GA4 endpoints and payloads it looks to only support custom events, so all other original functionality in expo-analytics was removed.


Expo GA4 Analytics
=========

Google Analytics 4 integration for use with React Native apps built on Expo.  Most of the other Google Analytics libraries I've found require linking, which is not supported with Expo.  This library does not require linking.


## Usage

```
import { Analytics } from 'expo-ga4-analytics';

const measurementId = 'G-########'
const apiSecret = 'XXXXXXXXXX'
const analytics = new Analytics(measurementId, apiSecret);
analytics.setUserId('user123')
analytics.track('My New View Event', {"contentId": 123})
```

All events are sent with user_properies 

```
  userProperties = {
      app_name: {value: Constants.manifest.name},
      app_id: {value: Constants.manifest.slug},
      app_version: {value: Constants.manifest.version},
      screen_resolution: {value: `${width}x${height}`}
  }
```