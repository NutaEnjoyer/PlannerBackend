import { ConfigService } from "@nestjs/config";

export const getPORT = async (
    ConfigService: ConfigService
): Promise<number> => {
    return ConfigService.get<number>("PORT", 3000)
}

export const getDOMAIN = async (
    ConfigService: ConfigService
): Promise<string> => {
    return ConfigService.get<string>("DOMAIN", "localhost")
}
