import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity'
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getAllReports() {
    return this.reportsService.getAllReports();
  }

  @Get('/estimate')
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body() reportsDto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    const report = await this.reportsService.create(reportsDto, user);
    return report;
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Body() body: ApproveReportDto, @Param('id') id: number) {
    return await this.reportsService.changeApproval(id, body.approved);
  }
}
