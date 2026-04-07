import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

class RowDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['standard', 'comfort'])
    type: 'standard' | 'comfort';

    @IsNumber()
    @Min(1)
    seats: number;
}

export class CreateHallDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RowDto)
    rows: RowDto[];
}