import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentInput } from './dto/create-student.input';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

describe('StudentResolver', () => {
  let resolver: StudentResolver;

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
      providers: [StudentResolver, StudentService],
    })
      .overrideProvider(StudentService)
      .useValue(mockStudentService)
      .compile();

    resolver = module.get<StudentResolver>(StudentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a student', ()=> {
    const dto:CreateStudentInput = { id:2, name: "student", email: "student@g.com", dob: "2000-03-03" }
    
    expect(resolver.createStudent(dto)).toEqual({
      data: {
        createStudents: {
          __typename: 'Student',
        },
      },
    }); 
  })
});
