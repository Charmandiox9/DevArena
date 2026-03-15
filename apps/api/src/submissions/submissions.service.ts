import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import * as vm from 'vm';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async evaluate(userId: string, dto: CreateSubmissionDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId },
      include: { testCases: true },
    });

    if (!challenge) throw new BadRequestException('Reto no encontrado');

    let isAllCorrect = true;
    let feedback = '¡Todos los casos de prueba pasaron exitosamente!';

    for (const testCase of challenge.testCases) {
      try {
        const sandbox = { result: null };
        vm.createContext(sandbox);

        const codeToEvaluate = `
          ${dto.content}
          // Ahora sí llamamos a la función del usuario inyectándole el input
          result = solve(${testCase.input}); 
        `;

        vm.runInContext(codeToEvaluate, sandbox, { timeout: 1000 });

        const userOutput = JSON.stringify(sandbox.result);
        const expected = JSON.stringify(JSON.parse(testCase.expectedOutput));

        if (userOutput !== expected) {
          isAllCorrect = false;
          feedback = `Error en caso de prueba. Input: ${testCase.input}. Esperado: ${expected}, pero tu código devolvió: ${userOutput}`;
          break;
        }
      } catch (error: any) {
        isAllCorrect = false;
        feedback = `Error de ejecución: ${error.message}`;
        break;
      }
    }

    const submission = await this.prisma.submission.create({
      data: {
        content: dto.content,
        status: isAllCorrect ? 'ACCEPTED' : 'REJECTED',
        feedback: feedback,
        userId: userId,
        challengeId: dto.challengeId,
      },
    });

    return {
      success: isAllCorrect,
      feedback: feedback,
      submissionId: submission.id,
    };
  }
}
