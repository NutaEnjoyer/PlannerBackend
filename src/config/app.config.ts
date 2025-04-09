import { ConfigService } from "@nestjs/config";

export const getPORT = async (
    ConfigService: ConfigService
): Promise<number> => {
    return ConfigService.get<number>("PORT", 3000)
}