import { Controller } from '@nestjs/common';
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
  createTask(
    createTaskDto: CreateTaskDto,
  ): Task | Observable<Task> | Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  findAllTasks(ownerId: OwnerId): Promise<Tasks> {
    return this.tasksService.findAllTasks(ownerId);
  }

  findOneTask(payload: TaskId): Task | Observable<Task> | Promise<Task> {
    return this.tasksService.findOneTask(payload.id);
     
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
