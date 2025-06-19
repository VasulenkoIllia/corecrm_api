import { Logger } from '@nestjs/common';

export function CatchError(logMessage: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger(target.constructor.name);

    descriptor.value = async function (...args: any[]) {
      try {
        // Фільтруємо аргументи, щоб уникнути циклічних структур
        const safeArgs = args.map((arg) => {
          if (arg && typeof arg === 'object') {
            // Ігноруємо об’єкти Request/Response або інші складні структури
            if ('socket' in arg || 'headers' in arg || 'body' in arg) {
              return '[Complex Object (e.g., Request)]';
            }
            try {
              // Спробуємо серіалізувати, щоб перевірити на циклічність
              JSON.stringify(arg);
              return arg;
            } catch {
              return '[Non-serializable Object]';
            }
          }
          return arg;
        });

        logger.log(`${logMessage} with args: ${JSON.stringify(safeArgs)}`);
        const result = await originalMethod.apply(this, args);
        logger.log(`${logMessage} completed successfully`);
        return result;
      } catch (error) {
        logger.error(`${logMessage} failed: ${error.message}, stack: ${error.stack}`);
        throw error;
      }
    };

    return descriptor;
  };
}