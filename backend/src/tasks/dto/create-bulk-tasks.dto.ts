import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateBulkTasksDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  titles: string[];
}
