import { createFunction } from './createFunction';

export type EventAction = 'LOGIN' | 'LOGOUT' | 'PURCHASE' | 'VIEW' | 'UPDATE_PROFILE';

export interface UserIdentity {
    userId: string;
    sessionId: string;
}

export interface RawEventContext {
    ipAddress: string;
    userAgent: string;
    timestamp: number;
}

export interface SensitiveData {
    password: string;
    token: string;
}

export interface DeviceContext {
    browser: string;
    os: string;
    device: string;
}

export interface RawEvent {
    identity: UserIdentity;
    action: EventAction;
    context: RawEventContext;
    device: DeviceContext;
    sensitiveData?: SensitiveData; // Optional because not all events have sensitive data
}

export interface EventWithProcessingTimestamp extends RawEvent {
    processedAt: number;
}
  
export interface SanitizedEvent extends EventWithProcessingTimestamp {
    readonly sanitizedData: {
      hasPassword: boolean;
      hasToken: boolean;
    };
}

export interface NormalizedEvent extends SanitizedEvent {
    normalizedContext: {
      region: string;
      timezone: string;
      locale: string;
    };
}

export type ProcessedEvent = NormalizedEvent;

const rawEvent: RawEvent = {
    identity: {
      userId: "user-7891011",
      sessionId: "sess-123456789"
    },
    action: "LOGIN",
    context: {
      ipAddress: "203.0.113.42",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      timestamp: 1710624780123 // March 16, 2025, 20:53:00.123 GMT
    },
    device: {
      browser: "Chrome",
      os: "macOS",
      device: "MacBook Pro"
    },
    sensitiveData: {
      password: "MyS3cureP@ssw0rd!",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTc4OTEwMTEiLCJpYXQiOjE3MTA2MjQ3ODAxMjN9.dummysignature"
    }
};

const addProcessingTimestamp = createFunction<RawEvent, EventWithProcessingTimestamp>((event) => {
    return {
        ...event,
        processedAt: Date.now()
    };
});

const sanitizeEvent = createFunction<EventWithProcessingTimestamp, SanitizedEvent>((event) => {
    // Create sanitized version
    const sanitizedEvent: SanitizedEvent = {
        ...event,
        sanitizedData: {
            hasPassword: !!event.sensitiveData?.password,
            hasToken: !!event.sensitiveData?.token
    }
    };

    const { sensitiveData, ...rest } = sanitizedEvent;
  
    return sanitizedEvent;
});

const normalizeEvent = createFunction<SanitizedEvent, NormalizedEvent>((event) => {
    return {
      ...event,
      normalizedContext: {
        region: determineRegion(event.context.ipAddress),
        timezone: determineTimezone(event.context.ipAddress),
        locale: determineLocale(event.device.os)
      }
    };
});

// Helper functions (would have actual implementations)
function determineRegion(ip: string): string {
    return "US-WEST";
}

function determineTimezone(ip: string): string {
    return "America/Los_Angeles";
}

function determineLocale(os: string): string {
    return "en-US";
}
  

function processEvent(rawEvent: RawEvent): NormalizedEvent {
    const enhancedTimestamper = addProcessingTimestamp
      .withLogger()
      .withTimer();
    
    const enhancedSanitizer = sanitizeEvent
      .withLogger()
      .withValidation((event) => !!event.processedAt);
    
    const enhancedNormalizer = normalizeEvent
      .withLogger()
      .withTimer();
    
    const withTimestamp = enhancedTimestamper.execute(rawEvent);
    const sanitized = enhancedSanitizer.execute(withTimestamp);
    const normalized = enhancedNormalizer.execute(sanitized);
    return normalized;
}

const processedEvent = processEvent(rawEvent);
console.log('Final processed event:', processedEvent);