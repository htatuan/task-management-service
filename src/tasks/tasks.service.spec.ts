import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task, Task as TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import {
  CreateTaskDto,
  RemoveTaskResponse,
  SearchRequest,
  UpdateTaskDto,
} from './proto/task';
import { InternalServerErrorException } from '@nestjs/common';

describe('TasksService', () => {
  let taskService: TasksService;
  let taskRepo: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(TaskEntity), useClass: Repository },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepo = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('createTask', () => {
    const task: Task = {
      id: 1,
      createdAt: new Date().toDateString(),
      ownerId: 1,
      status: 'TO DO',
      title: 'Create a new task',
      updatedAt: new Date().toDateString(),
    };

    const createTaskDto: CreateTaskDto = {
      title: 'Create a new task',
      status: 'TO DO',
      ownerId: 1,
    };

    it('should create a task', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(taskRepo, 'create').mockReturnValue(task);
      jest.spyOn(taskRepo, 'save').mockResolvedValue(task);

      const result = await taskService.createTask(createTaskDto);
      const expectedResult: TaskEntity = {
        id: 1,
        createdAt: new Date().toDateString(),
        ownerId: 1,
        status: 'TO DO',
        title: 'Create a new task',
        updatedAt: new Date().toDateString(),
      };

      expect(result).toEqual(expectedResult);
    });

    it('should throw RpcException if task already exists', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(task);

      await expect(taskService.createTask(createTaskDto)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('updateTask', () => {
    const task: Task = {
      id: 1,
      createdAt: new Date().toDateString(),
      ownerId: 1,
      status: 'IN PROGRESS',
      title: 'Update a task',
      updatedAt: new Date().toDateString(),
    };

    const updateTaskDto: UpdateTaskDto = {
      status: 'IN PROGRESS',
      id: 1,
    };

    it('should update a task', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(task);
      jest.spyOn(taskRepo, 'save').mockResolvedValue(task);

      const result = await taskService.updateTask(1, updateTaskDto);
      const expectedResult: TaskEntity = {
        id: 1,
        createdAt: new Date().toDateString(),
        ownerId: 1,
        status: 'IN PROGRESS',
        title: 'Update a task',
        updatedAt: new Date().toDateString(),
      };

      expect(result).toEqual(expectedResult);
      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(taskRepo.save).toHaveBeenCalledWith({
        id: 1,
        status: 'IN PROGRESS',
        ownerId: 1,
        title: 'Update a task',
      });
    });

    it('should throw RpcException if task not exists', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(null);

      await expect(taskService.updateTask(1, updateTaskDto)).rejects.toThrow(
        RpcException,
      );

      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('removeTask', () => {
    const task: Task = {
      id: 1,
      createdAt: new Date().toDateString(),
      ownerId: 1,
      status: 'IN PROGRESS',
      title: 'Update a task',
      updatedAt: new Date().toDateString(),
    };

    it('should remove a task', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(task);
      jest
        .spyOn(taskRepo, 'delete')
        .mockResolvedValue({ affected: 1, raw: null });

      const result = await taskService.remove(1);
      const expectedResult: RemoveTaskResponse = {
        isSuccess: true,
      };

      expect(result).toEqual(expectedResult);
      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(taskRepo.delete).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw RpcException if task not found', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(null);

      await expect(taskService.remove(1)).rejects.toThrow(RpcException);
    });

    it('should throw RpcException if task status is ARCHIVED', async () => {
      const deleteTask: Task = {
        id: 1,
        createdAt: new Date().toDateString(),
        ownerId: 1,
        status: 'ARCHIVED',
        title: 'Update a task',
        updatedAt: new Date().toDateString(),
      };
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(deleteTask);

      await expect(taskService.remove(1)).rejects.toThrow(RpcException);
    });

    it('should throw RpcException if task deletion fails', async () => {
      jest.spyOn(taskRepo, 'findOneBy').mockResolvedValue(task);
      jest
        .spyOn(taskRepo, 'delete')
        .mockResolvedValue({ affected: 0, raw: null });

      await expect(taskService.remove(1)).rejects.toThrow(RpcException);
    });

    describe('findAllTasks', () => {
      it('should find all tasks for a given owner', async () => {
        const tasks: TaskEntity[] = [
          {
            id: 1,
            createdAt: 'createdAt',
            ownerId: 1,
            status: 'TODO',
            title: 'title',
            updatedAt: 'updatedAt',
          },
        ];
        const expectedResult: TaskEntity[] = [
          {
            id: 1,
            createdAt: 'createdAt',
            ownerId: 1,
            status: 'TODO',
            title: 'title',
            updatedAt: 'updatedAt',
          },
        ];
        jest.spyOn(taskRepo, 'findBy').mockResolvedValue(tasks);

        const result = await taskService.findAllTasks({ ownerId: 1 });

        expect(tasks).toEqual(expectedResult);
      });
    });

    describe('searchTask', () => {
      it('should search for tasks based on search criteria', async () => {
        const searchRequest: SearchRequest = {
          ownerId: 1,
          keyword: 'exampleKeyword',
        };
        const tasks: TaskEntity[] = [
          {
            id: 1,
            createdAt: 'createdAt',
            ownerId: 1,
            status: 'TODO',
            title: 'title',
            updatedAt: 'updatedAt',
          },
        ];
        jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(tasks),
        } as any);

        const result = await taskService.searchTask(searchRequest);

        expect(result).toEqual({ Tasks: tasks });
      });

      it('should handle errors and throw RpcException if repository throws an error', async () => {
        const searchRequest: SearchRequest = {
          ownerId: 1,
          keyword: 'exampleKeyword',
        };
        jest.spyOn(taskRepo, 'createQueryBuilder').mockImplementation(() => {
          throw new InternalServerErrorException();
        });

        await expect(taskService.searchTask(searchRequest)).rejects.toThrow(
          new InternalServerErrorException(),
        );
      });

      it('should handle errors and throw RpcException if repository throws an error in get Many', async () => {
        const searchRequest: SearchRequest = {
          ownerId: 1,
          keyword: 'exampleKeyword',
        };
        jest.spyOn(taskRepo, 'createQueryBuilder').mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockImplementation(() => {
            throw new InternalServerErrorException();
          }),
        } as any);

        await expect(taskService.searchTask(searchRequest)).rejects.toThrow(
          new InternalServerErrorException(),
        );
      });
    });
  });
});
