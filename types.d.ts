export interface EventParameter {
  [key: string]: any;
}

export class Analytics {
  constructor(measurementId: string, apiSecret: string, options?: Options);
  track(eventName: string, params: EventParameter): Promise<void>;
  setUserId(userId: string): void;
}

export interface Options {
  debug?: boolean;
}

