import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import {
  CreateTaskDto,
  OwnerId,
  RemoveTaskResponse,
  Tasks,
} from './proto/task';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}
  async createTask(createTaskDto: CreateTaskDto) {
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

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  async remove(id: number): Promise<RemoveTaskResponse> {
    const check = await this.taskRepo.findOneBy({ id });
    if (!check) {
      throw new RpcException('Task not found!');
    } else {
      if (check.status == 'ARCHIVED') {
        throw new RpcException('Can not delete this task!');
      } else {
        const res = await this.taskRepo.delete({ id });
        if (res.affected) {
          return { isSuccess: true };
        }
      }
    }
  }
}
