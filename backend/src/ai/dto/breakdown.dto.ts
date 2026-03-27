import { IsString, IsNotEmpty } from 'class-validator';

export class BreakdownDto {
  @IsString()
  @IsNotEmpty()
  taskTitle: string;
}
