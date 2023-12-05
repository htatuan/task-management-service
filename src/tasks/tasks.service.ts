import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, OwnerId, Tasks } from './proto/task';
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

  findOneTask(id: number): Promise<Task> {
    return this.taskRepo.findOneBy({ id: id });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
