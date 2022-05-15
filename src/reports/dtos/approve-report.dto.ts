import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveReportDto {
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;
}
