import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  OwnerId,
  RemoveTaskResponse,
  SearchRequest,
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
  searchTask(
    request: SearchRequest,
  ): Tasks | Promise<Tasks> | Observable<Tasks> {
    return this.tasksService.searchTask(request);
  }

  createTask(
    createTaskDto: CreateTaskDto,
  ): Task | Observable<Task> | Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  findAllTasks(ownerId: OwnerId): Promise<Tasks> {
    return this.tasksService.findAllTasks(ownerId);
  }

  updateTask(request: UpdateTaskDto): Task | Observable<Task> | Promise<Task> {
    return this.tasksService.updateTask(request.id, request);
  }

  removeTask(
    request: TaskId,
  ):
    | RemoveTaskResponse
    | Observable<RemoveTaskResponse>
    | Promise<RemoveTaskResponse> {
    return this.tasksService.remove(request.id);
  }
}
