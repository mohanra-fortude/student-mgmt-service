import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentInput } from './dto/create-student.input';
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

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create student', async() => {
    const entry: CreateStudentInput = {
      id: 2,
      name: 'student',
      email: 'student@g.com',
      dob: '2000-03-03',
    };

    const result = service.create(entry).catch((err)=>console.log(err))

    jest.spyOn(service, 'create').mockImplementation(() => result);

  })

  
  
    
});
