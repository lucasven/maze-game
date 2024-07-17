import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MazeService } from './maze.service';
import { ValantDemoApiClient } from '../api-client/api-client';

describe('MazeService', () => {
  let service: MazeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MazeService, {provide: ValantDemoApiClient.Client, useClass: HttpClientTestingModule} ],
    });
    service = TestBed.inject(MazeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
