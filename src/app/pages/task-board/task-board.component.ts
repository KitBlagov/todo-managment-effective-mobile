import { Component } from '@angular/core';
import { ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Task } from '../../models/task.model';
import { NgForOf, NgIf } from "@angular/common";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent implements OnInit {
  tasks$: Observable<Task[]> = new Observable<Task[]>();
  filteredTasks$: Observable<Task[]> = new Observable<Task[]>();
  statusFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  executorFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  deadlineFilter$: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  executors$: Observable<string[]> = new Observable<string[]>();

  constructor(private todoService: TodoService, private router: Router) { }

  ngOnInit(): void {
    this.tasks$ = this.todoService.tasks$;

    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.statusFilter$,
      this.executorFilter$,
      this.deadlineFilter$
    ]).pipe(
      map(([tasks, status, executor, deadline]) => {
        let filteredTasks = tasks;

        if (status) {
          filteredTasks = filteredTasks.filter(task => task.status === status);
        }

        if (executor) {
          filteredTasks = filteredTasks.filter(task => task.executor === executor);
        }

        if (deadline) {
          filteredTasks = filteredTasks.filter(task => {
            const taskDeadline = new Date(task.deadline);
            return taskDeadline.toDateString() === deadline.toDateString();
          });
        }

        return filteredTasks;
      })
    );

    this.executors$ = this.todoService.getUniqueExecutors();
  }

  filterByStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value !== null) {
      this.statusFilter$.next(value);
    }
  }

  filterByExecutor(event: Event): void {
    const executor = (event.target as HTMLSelectElement)?.value;
    if (executor !== null) {
      this.executorFilter$.next(executor);
    }
  }

  filterByDeadline(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const dateString = inputElement.value;
    const deadline = dateString ? new Date(dateString) : null;

    this.deadlineFilter$.next(deadline);
  }

  goToTaskList(): void {
    this.router.navigate(['/tasks']);
  }
}
