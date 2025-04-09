import { IsNumber, IsOptional, Min, Max, IsEmail, MinLength, IsString } from "class-validator";

export class PomodoroSettingsDto { 
    @IsOptional()
    @IsNumber()
    @Min(1)
    workInterval?: number

    @IsOptional()
    @IsNumber()
    @Min(1)
    breakInterval?: number

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    intervalsCount?: number
}

export class UserDto extends PomodoroSettingsDto { 
    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @MinLength(6, {
        message: "Password must be at least 6 characters long"
    })
    @IsOptional()
    @IsString()
    password?: string
}