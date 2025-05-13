import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min, Max, IsEmail, MinLength, IsString, IsBoolean, IsEnum } from "class-validator";

export class TaskDto { 
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean

    @IsOptional()
    @IsString()
    сreatedAt?: string

    @IsOptional()
    @IsEnum(Priority)
    @Transform(({ value }) => ('' + value).toLowerCase())
    priority?: Priority
}