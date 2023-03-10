// Deriviative of origin file Copyright (c) 2017 Ryan Vanderpol
// https://github.com/betaacid/expo-analytics

import { Platform, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

let defaultOptions = { debug: false };

let webViewUserAgent = null;
const getWebViewUserAgent = async (options) => {
    return new Promise((resolve) => {
        if (options.userAgent) {
            webViewUserAgent = options.userAgent;
            return resolve(options.userAgent);
        }
        if (webViewUserAgent) return resolve(webViewUserAgent);
        Constants.getWebViewUserAgentAsync()
          .then(userAgent => {
              webViewUserAgent = userAgent;
              resolve(userAgent);
          })
          .catch(() => resolve('unknown user agent'))
    });
}

export default class Analytics {
    customDimensions = []
    customMetrics = []
    userId = null

    constructor(measurementId, apiSecret, options = defaultOptions){

        this.measurementId = measurementId;
        this.apiSecret = apiSecret;

        this.options = options;
        this.clientId = Constants.installationId;

        this.userProperties = {
            app_name: {value: Constants.manifest.name},
            app_id: {value: Constants.manifest.slug},
            app_version: {value: Constants.manifest.version},
            screen_resolution: {value: `${width}x${height}`}
        }

        this.promiseGetWebViewUserAgentAsync = getWebViewUserAgent(options)
            .then(userAgent => {
                this.userAgent = userAgent;
                if(this.options.debug){
                    console.log(`[expo-ga4-analytics] UserAgent=${userAgent}`);
                }
            });
    }

    track(eventName, params) {

        if(this.options.debug) {
            console.log(`[expo-ga4-analytics] track ${eventName} with params ${JSON.stringify(params)}`);
        }
        
        let event = {
            name: eventName, 
            params: params
        }
        // send only after the user agent is saved
        return this.promiseGetWebViewUserAgentAsync
            .then(() => this.send(event));
    }

    setUserId(userId) {
        this.userId = userId
    }

    send(event) {

        const url = `https://www.google-analytics.com/mp/collect?api_secret=${this.apiSecret}&measurement_id=${this.measurementId}`

        let payload = {
            user_properties: this.userProperties,
            non_personalized_ads: true,
            client_id: this.clientId, 
            events: [ // We can send up to 25 events in one call
                event
            ]            
        }
        if(this.userId) {
            payload['user_id'] = this.userId
        }

        let options = {
            method: 'post',
            headers: {
                'User-Agent': this.userAgent,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };        

        if (Platform.OS === 'web') {
            //Request opaque resources to avoid preflight CORS error in Safari
            options.mode = 'no-cors'; // no-cors, *cors, same-origin
        }        
        return fetch(url, options);
    }
}