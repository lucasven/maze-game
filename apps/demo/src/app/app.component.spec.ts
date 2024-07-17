import { of } from 'rxjs';
import { Shallow } from 'shallow-render';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { SilentLogger } from './logging/silent-logger';
import { MazeService } from './maze/maze.service';
import { setupJestCanvasMock } from 'jest-canvas-mock';

const mockMazeService = { getPossibleMovements: jest.fn(() => of([])) };

describe('AppComponent', () => {
  let component: Shallow<AppComponent>;

  beforeEach(() => {
    component = new Shallow(AppComponent, AppModule)
      .provideMock({ provide: MazeService, useValue: mockMazeService })
      .provideMock({ provide: LoggingService, useClass: SilentLogger });
    jest.clearAllMocks();
    setupJestCanvasMock();
  });

  it('should render', async () => {
    const rendering = await component.render();
    expect(rendering).toBeTruthy();
  });

  it('should have as title "Valant demo"', async () => {
    const { instance } = await component.render();
    expect(instance.title).toBe('Valant demo');
  });

  it('should render a banner message', async () => {
    const { find } = await component.render();
    expect(find('h1').nativeElement.textContent).toBe('Welcome to Valant demo');
  });

  it('gets stuff from the API on init', async () => {
    await component.render();
    expect(mockMazeService.getPossibleMovements).toHaveBeenCalledTimes(1);
  });
});

