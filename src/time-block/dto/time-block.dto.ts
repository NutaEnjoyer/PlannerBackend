import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min, Max, IsEmail, MinLength, IsString, IsBoolean, IsEnum } from "class-validator";

export class TimeBlockDto { 
    @IsString()
    name: string

    @IsOptional()
    @IsString() 
    color?: string

    @IsNumber()
    duration: number

    @IsNumber()
    @IsOptional()
    order?: number
}