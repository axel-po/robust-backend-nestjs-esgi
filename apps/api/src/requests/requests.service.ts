import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RequestStatus } from '../dto';
import type {
  MentorshipRequest,
  CreateRequestDto,
  UpdateRequestStatusDto,
} from '../dto';
import { RequestsRepository } from './requests.repository';
import { SessionsRepository } from '../sessions/sessions.repository';
import type { MentorshipRequest as DbRequest } from '../database/schema';

@Injectable()
export class RequestsService {
  constructor(
    private readonly requestsRepository: RequestsRepository,
    private readonly sessionsRepository: SessionsRepository,
  ) {}

  async getAllForUser(userId: string): Promise<MentorshipRequest[]> {
    const requests = await this.requestsRepository.findAllForUser(userId);
    return requests.map(this.toPublic);
  }

  async create(
    menteeId: string,
    dto: CreateRequestDto,
  ): Promise<MentorshipRequest> {
    const request = await this.requestsRepository.create(menteeId, dto);
    return this.toPublic(request);
  }

  async updateStatus(
    id: string,
    userId: string,
    dto: UpdateRequestStatusDto,
  ): Promise<MentorshipRequest> {
    const request = await this.requestsRepository.findById(id);
    if (!request) throw new NotFoundException('Request not found');
    if (request.mentorId !== userId && request.menteeId !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    const updated = await this.requestsRepository.updateStatus(id, dto.status);
    if (dto.status === RequestStatus.ACCEPTED) {
      await this.sessionsRepository.create({
        mentorId: request.mentorId,
        menteeId: request.menteeId,
        requestId: request.id,
      });
    }
    return this.toPublic(updated);
  }

  private toPublic = (req: DbRequest): MentorshipRequest => ({
    id: req.id,
    mentorId: req.mentorId,
    menteeId: req.menteeId,
    message: req.message,
    status: req.status as RequestStatus,
    createdAt: req.createdAt,
  });
}
