import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task as TaskEntity } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tasks, Task, RemoveTaskResponse } from './proto/task';

describe('TasksController', () => {
  let controller: TasksController;
  let taskService: TasksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllTasks', () => {
    it('Should return all task', async () => {
      const mockReturnedData: Tasks = {
        Tasks: [
          {
            id: 1,
            createdAt: '2023-12-14',
            ownerId: 1,
            status: 'TO DO',
            title: 'Test only',
            updatedAt: '2023-12-14',
          },

          //
        ],
      };
      const expectedData: Tasks = {
        Tasks: [
          {
            id: 1,
            createdAt: '2023-12-14',
            ownerId: 1,
            status: 'TO DO',
            title: 'Test only',
            updatedAt: '2023-12-14',
          },

          //
        ],
      };

      jest
        .spyOn(taskService, 'findAllTasks')
        .mockResolvedValue(mockReturnedData);

      const result = await controller.findAllTasks({ ownerId: 1 });
      expect(result).toEqual(expectedData);
      expect(taskService.findAllTasks).toHaveBeenCalledWith({ ownerId: 1 });
    });

    it('Should return no task', async () => {
      const mockReturnedData: Tasks = {
        Tasks: [],
      };
      const expectedData: Tasks = {
        Tasks: [],
      };

      jest
        .spyOn(taskService, 'findAllTasks')
        .mockResolvedValue(mockReturnedData);

      const result = await controller.findAllTasks({ ownerId: 1 });
      expect(result).toEqual(expectedData);
      expect(taskService.findAllTasks).toHaveBeenCalledWith({ ownerId: 1 });
    });
  });

  describe('searchTasks', () => {
    it('Should return all task searched by criteria', async () => {
      const mockReturnedData: Tasks = {
        Tasks: [
          {
            id: 1,
            createdAt: '2023-12-14',
            ownerId: 1,
            status: 'TO DO',
            title: 'Test only',
            updatedAt: '2023-12-14',
          },

          //
        ],
      };
      const expectedData: Tasks = {
        Tasks: [
          {
            id: 1,
            createdAt: '2023-12-14',
            ownerId: 1,
            status: 'TO DO',
            title: 'Test only',
            updatedAt: '2023-12-14',
          },

          //
        ],
      };

      jest.spyOn(taskService, 'searchTask').mockResolvedValue(mockReturnedData);

      const result = await controller.searchTask({
        ownerId: 1,
        keyword: 'test',
      });
      expect(result).toEqual(expectedData);
      expect(taskService.searchTask).toHaveBeenCalledWith({
        ownerId: 1,
        keyword: 'test',
      });
    });

    it('Should return no task', async () => {
      const mockReturnedData: Tasks = {
        Tasks: [],
      };
      const expectedData: Tasks = {
        Tasks: [],
      };

      jest.spyOn(taskService, 'searchTask').mockResolvedValue(mockReturnedData);

      const result = await controller.searchTask({
        ownerId: 1,
        keyword: 'test',
      });
      expect(result).toEqual(expectedData);
      expect(taskService.searchTask).toHaveBeenCalledWith({
        ownerId: 1,
        keyword: 'test',
      });
    });
  });

  describe('createTask', () => {
    it('Should create task successfully', async () => {
      const mockReturnedData: Task = {
        id: 1,
        ownerId: 1,
        status: 'TO DO',
        title: 'Test Title',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };

      const expectedData: Task = {
        id: 1,
        ownerId: 1,
        status: 'TO DO',
        title: 'Test Title',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };

      jest.spyOn(taskService, 'createTask').mockResolvedValue(mockReturnedData);

      const result = await controller.createTask({
        ownerId: 1,
        title: 'Test Title',
        status: 'TODO',
      });
      expect(result).toEqual(expectedData);
      expect(taskService.createTask).toHaveBeenCalledWith({
        ownerId: 1,
        title: 'Test Title',
        status: 'TODO',
      });
    });
  });

  describe('updateTask', () => {
    it('Should update task successfully', async () => {
      const mockReturnedData: Task = {
        id: 1,
        ownerId: 1,
        status: 'IN PROGRESS',
        title: 'Test Title',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };

      const expectedData: Task = {
        id: 1,
        ownerId: 1,
        status: 'IN PROGRESS',
        title: 'Test Title',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      };

      jest.spyOn(taskService, 'updateTask').mockResolvedValue(mockReturnedData);

      const result = await controller.updateTask({
        id: 1,
        status: 'IN PROGRESS',
      });
      expect(result).toEqual(expectedData);
      expect(taskService.updateTask).toHaveBeenCalledWith(1, {
        id: 1,
        status: 'IN PROGRESS',
      });
    });
  });

  describe('delete task', () => {
    it('Should delete task successfully', async () => {
      const mockReturnedData: RemoveTaskResponse = {
        isSuccess: true,
      };

      const expectedData: RemoveTaskResponse = {
        isSuccess: true,
      };

      jest.spyOn(taskService, 'remove').mockResolvedValue(mockReturnedData);

      const result = await controller.removeTask({
        id: 1,
      });
      expect(result).toEqual(expectedData);
      expect(taskService.remove).toHaveBeenCalledWith(1);
    });
  });
});
