import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValantDemoApiClient } from '../api-client/api-client';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root',
})
export class MazeService {
  constructor(private httpClient: ValantDemoApiClient.Client) {}

  public getPossibleMovements(cell:Cell, row:number, col:number): Observable<string[]> {
    return this.httpClient.maze(cell.northWall, cell.southWall, cell.eastWall, cell.westWall, cell.row, cell.col, row, col);
  }
}
