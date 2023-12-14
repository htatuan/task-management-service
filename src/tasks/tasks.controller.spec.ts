import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { Task, Task as TaskEntity } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tasks } from './proto/task';

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

          // Add more tasks as needed
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

          // Add more tasks as needed
        ],
      };

      jest
        .spyOn(taskService, 'findAllTasks')
        .mockResolvedValue(mockReturnedData);

      const result = await controller.findAllTasks({ ownerId: 1 });
      expect(result).toEqual(expectedData);
      expect(taskService.findAllTasks).toHaveBeenCalledWith({ ownerId: 1 }); // Check if the method was called with the correct parameter
    });
  });
});
