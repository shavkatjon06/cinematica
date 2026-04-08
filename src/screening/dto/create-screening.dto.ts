import { Type } from "class-transformer";
import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";

class PriceDto {
    @IsNumber()
    @Min(0)
    standard: number;

    @IsNumber()
    @Min(0)
    comfort: number;
}

export class CreateScreeningDto {
    @IsMongoId()
    @IsNotEmpty()
    movieId: string;

    @IsMongoId()
    @IsNotEmpty()
    hallId: string;

    @IsDateString()
    startTime: string;

    @ValidateNested()
    @Type(() => PriceDto)
    price: PriceDto;
}
