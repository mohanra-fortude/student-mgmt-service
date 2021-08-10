import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all students', async () => {
      jest.spyOn(service, 'findAll');
      expect((await service.findAll()).length).toBeGreaterThan(0);
    });
 
  // it('should delete student from list', async () => {
  //     const deleteStudent: DeleteStudentInput = {
  //       id: 3
  //     };
  //     jest.spyOn(service, 'deleteStudent');
  //   expect(await service.deleteStudent(deleteStudent)).toBeGreaterThan(0);
    
});
