import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChallengeDto) {
    const slug = dto.title
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    return this.prisma.challenge.create({
      data: {
        title: dto.title,
        slug: slug,
        description: dto.description,
        difficulty: dto.difficulty,
        points: dto.points,
        referenceSolution: dto.referenceSolution,
        categoryId: dto.categoryId,
        testCases: {
          create: dto.testCases,
        },
      },
      include: {
        testCases: true,
      },
    });
  }

  async findAll() {
    return this.prisma.challenge.findMany({
      include: {
        category: true,
      },
    });
  }
}
