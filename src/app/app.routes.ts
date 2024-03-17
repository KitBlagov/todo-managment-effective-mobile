import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskBoardComponent } from './pages/task-board/task-board.component';


export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'task-board', component: TaskBoardComponent },
];
