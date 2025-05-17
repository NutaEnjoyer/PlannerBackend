import { ConfigService } from "@nestjs/config";


export async function getConfigValue<T> (
    configService: ConfigService,
    key: string,
    defaultValue?: T
  ): Promise<T> {
    const value = await configService.get(key);
    if (!value) {
      return defaultValue as T;
    }
    return value as T;
  }