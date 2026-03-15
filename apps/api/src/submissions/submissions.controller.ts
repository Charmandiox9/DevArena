import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  evaluateCode(
    @Request() req,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    return this.submissionsService.evaluate(
      req.user.userId,
      createSubmissionDto,
    );
  }
}
