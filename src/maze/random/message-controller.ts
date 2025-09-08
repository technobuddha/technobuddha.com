import { Random, type RandomProperties } from './random.ts';

export type MessageOptions = {
  color?: string;
  level?: 'error' | 'warning' | 'info';
};

export type MessageCallback = (message: string, options: MessageOptions) => void;

export type MessageControllerProperties = RandomProperties;

export class MessageController extends Random {
  private readonly eventTarget: EventTarget;
  private readonly handlers = new WeakMap<MessageCallback, (event: Event) => void>();

  public constructor(props: RandomProperties = {}) {
    super(props);
    this.eventTarget = new EventTarget();
  }

  public sendMessage(message: string, { color, level }: MessageOptions = {}): void {
    this.eventTarget.dispatchEvent(
      new CustomEvent('message', {
        detail: { message, color, level },
      }),
    );
  }

  public listenMessages(callback: MessageCallback): void {
    const handler = (event: Event): void => {
      const { message, ...options } = (event as CustomEvent).detail;
      callback(message, options);
    };

    this.handlers.set(callback, handler);

    this.eventTarget.addEventListener('message', handler);
  }

  public ignoreMessages(callback: MessageCallback): void {
    const handler = this.handlers.get(callback);
    if (handler) {
      this.eventTarget.removeEventListener('message', handler);
      this.handlers.delete(callback);
    }
  }
}
