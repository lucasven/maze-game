import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { LoggingService } from './logging/logging.service';
import { MazeService } from './maze/maze.service';
import { ValantDemoApiClient } from './api-client/api-client';
import { Maze } from './models/maze';
import { Cell } from './models/cell';
import { keyboardMap } from './models/keyboard-map';

@Component({
  selector: 'valant-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'Valant demo';
  public up: boolean = false;
  public down: boolean = false;
  public right: boolean = false;
  public left: boolean = false;

  row = 3;
  col = 3;
  cellSize = 20; // cell size
  private maze: Maze;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell;

  constructor(private logger: LoggingService, private mazeService: MazeService) {}

  ngOnInit() {
    this.logger.log('Welcome to the AppComponent');
  }

  ngAfterViewInit() {
    this.canvas = <HTMLCanvasElement>document.getElementById('maze');
    this.ctx = this.canvas.getContext('2d');
    this.drawMaze();
  }
  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
    this.getPossibleMovements(this.currentCell, this.row, this.col);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    const direction = keyboardMap[event.key];
    if (direction) this.move(direction);
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell: Cell;
    if (direction === 'Left') {
      if(!this.left)return;
      if (this.currentCell.col < 1) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col - 1
      ];
    }
    if (direction === 'Right') {
      if(!this.right)return;
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col + 1
      ];
    }
    if (direction === 'Up') {
      if(!this.up)return;
      if (this.currentCell.row < 1) return;
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
      ];
    }
    if (direction === 'Down') {
      if(!this.down)return;
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
      ];
    }
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          this.resetControls();
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
      this.getPossibleMovements(this.currentCell, this.row, this.col);
    }
  }

  solution() {
    this.gameOver = true;
    this.maze.drawSolution('#ff7575', 3);
  }

  resetControls() {
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
  }	

  private getPossibleMovements(currentCell:Cell, row: number, col: number): void {
    this.mazeService.getPossibleMovements(currentCell, row, col).subscribe({
      next: (response: string[]) => {
        this.resetControls();
        response.forEach(element => {
          if(element == 'Up')
            this.up = true;
          if(element == 'Down')
            this.down = true;
          if(element == 'Right')
            this.right = true;
          if(element == 'Left')
            this.left = true;
        });
      },
      error: (error) => {
        this.logger.error('Error getting stuff: ', error);
      },
    });
  }
}
