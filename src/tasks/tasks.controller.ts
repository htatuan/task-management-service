import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  OwnerId,
  RemoveTaskResponse,
  Task,
  TaskId,
  TaskServiceController,
  TaskServiceControllerMethods,
  Tasks,
  UpdateTaskDto,
} from './proto/task';
import { Observable } from 'rxjs';

@Controller()
@TaskServiceControllerMethods()
export class TasksController implements TaskServiceController {
  constructor(private readonly tasksService: TasksService) {}
  createTask(request: CreateTaskDto): Task | Observable<Task> | Promise<Task> {
    throw new Error('Method not implemented.');
  }

  findAllTasks(request: OwnerId): Tasks {
    const tasks: Task[] = [{ id: 1, title: 'a', status: 'b', ownerId: 1 }];
    return { Tasks: tasks };
  }

  findOneTask(request: TaskId): Task | Observable<Task> | Promise<Task> {
    throw new Error('Method not implemented.');
  }

  updateTask(request: UpdateTaskDto): Task | Observable<Task> | Promise<Task> {
    throw new Error('Method not implemented.');
  }

  removeTask(
    request: TaskId,
  ):
    | RemoveTaskResponse
    | Observable<RemoveTaskResponse>
    | Promise<RemoveTaskResponse> {
    throw new Error('Method not implemented.');
  }
}
