import {
  IsString,
  IsEnum,
  IsInt,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty } from '@devarena/database';

class CreateTestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expectedOutput: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsInt()
  @IsOptional()
  weight?: number;
}

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsInt()
  points: number;

  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  referenceSolution?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases: CreateTestCaseDto[];
}
