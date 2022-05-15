import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}
  async getAllReports() {
    const a = await this.repo.findAndCount();
    return a;
  }

  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lat, lng, mileage, year } = estimateDto;
    // const a = await this.repo.findBy({ make: make, model: model });
    const a = await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('lower(make) = :make AND lower(model) = :model', { make : make.toLowerCase(), model : model.toLowerCase() })
      .andWhere('lng = :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat = :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year = :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS true')
      .orderBy('mileage', 'ASC')
      .limit(3)
      // .getRawMany();
      .getRawOne();
    console.log(a);
    return a;
  }

  getReport(id: number) {
    const a = this.repo.findOneBy({ id });
    return a;
  }

  async create(reportDto: CreateReportDto, user: User) {
    // const report = await this.repo.insert(reportDto);
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approve: boolean) {
    const report = await this.getReport(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    report.approved = approve;
    return this.repo.save(report);
  }
}
