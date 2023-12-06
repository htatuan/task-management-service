import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateTaskDto,
  OwnerId,
  RemoveTaskResponse,
  Task,
  Tasks,
  UpdateTaskDto,
} from './proto/task';
import { RpcException } from '@nestjs/microservices';
import { Task as TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskEntity) private taskRepo: Repository<Task>) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy(createTaskDto);
    if (task) {
      throw new RpcException('Task already exists');
    }
    const newUser = this.taskRepo.create(createTaskDto);
    return this.taskRepo.save(newUser);
  }

  async findAllTasks(owner: OwnerId): Promise<Tasks> {
    const tasks = await this.taskRepo.findBy({ ownerId: owner.ownerId });
    return { Tasks: tasks };
  }

  async findOneTask(id: number): Promise<Task> {
    const res = await this.taskRepo.findOneBy({ id });
    if (!res) {
      throw new RpcException('Task not found!');
    }

    return res;
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new RpcException('Task not found');
    }
    return this.taskRepo.save({
      id,
      status: updateTaskDto.status,
      ownerId: task.ownerId,
      title: task.title,
    });
  }

  async remove(id: number): Promise<RemoveTaskResponse> {
    const res = await this.taskRepo.delete({ id });
    if (res.affected) {
      return { isSuccess: true };
    }

    return { isSuccess: false };
  }
}
