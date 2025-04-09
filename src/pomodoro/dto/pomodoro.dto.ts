import { IsNumber, IsOptional, Min, Max, IsEmail, MinLength, IsString, IsBoolean, IsEnum } from "class-validator";

export class PomodoroSessionDto { 
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean
}

export class PomodoroRoundDto { 
    @IsNumber()
    totalSeconds: number

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean 
}