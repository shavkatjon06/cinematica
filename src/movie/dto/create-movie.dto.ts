import { ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(1)
    duration: number; // in minutes

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    genre: string[];

    @IsUrl()
    trailer: string;

    @IsString()
    @IsIn(['G', 'PG', 'PG-13', 'R', 'NC-17'])
    ageRating: string;
}