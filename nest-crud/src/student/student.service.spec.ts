import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  const mockStudentService = {
    create: jest.fn((dto) => {
      return {
        data: {
          createStudents: {
            __typename: 'Student',
          },
        },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create student', async () => {
    const entry: CreateStudentInput = {
      id: 2,
      name: 'student',
      email: 'student@g.com',
      dob: '2000-03-03',
    };

    const studentSpy = jest.spyOn(service, 'create');
    service.create(entry);
    expect(studentSpy).toHaveBeenCalledWith(entry);
  });

  it('should create students', async () => {
    const entry: CreateStudentInput[] = [
      {
        id: 2,
        name: 'student',
        email: 'student@g.com',
        dob: '2000-03-03',
      },
    ];

    const studentSpy = jest.spyOn(service, 'createStudents');
    service.createStudents(entry);
    expect(studentSpy).toHaveBeenCalledWith(entry);
  });

  it('should delete student', async () => {
    const entry = 2;

    const studentSpy = jest.spyOn(service, 'remove');
    service.remove(entry);
    expect(studentSpy).toHaveBeenCalledWith(entry);
  });

  it('should update student', async () => {
    const entry: UpdateStudentInput = {
      id: 2,
      name: 'student',
      email: 'student@g.com',
      dob: '2000-03-03',
    };

    const studentSpy = jest.spyOn(service, 'update');
    service.update(entry.id, entry);
    expect(studentSpy).toHaveBeenCalledWith(entry.id, entry);
  });

  it('should get student', async () => {
    const studentSpy = jest.spyOn(service, 'findAll');
    service.findAll();
    expect(studentSpy).toHaveBeenCalled();
  });
});
