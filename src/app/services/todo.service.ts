import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import {BehaviorSubject, Observable, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasks: Task[] = [];
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasksFromLocalStorage();
  }

  getTasks(): Task[] {
    return this.tasks
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  addTask(task: Task): void {
    if (!task.id) {
      task.id = Date.now();
    }
    const updatedTasks = [...this.tasks, task];
    this.tasks = updatedTasks;
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks);
  }

  updateTask(updatedTask: Task): void {
    const updatedTasks = this.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
    this.tasks = updatedTasks;
    this.saveTasks(updatedTasks);
  }

  deleteTask(id: number): void {
    const updatedTasks = this.tasks.filter(task => task.id !== id);
    this.tasks = updatedTasks;
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks);
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  private loadTasksFromLocalStorage(): void {
    const tasksString = localStorage.getItem('tasks');
    if (tasksString) {
      this.tasks = JSON.parse(tasksString);
      this.tasksSubject.next(this.tasks);
    }
  }

  getUniqueExecutors(): Observable<string[]> {
    return this.tasksSubject.pipe(
      map(tasks => {
        const executorsSet = new Set<string>();
        tasks.forEach(task => executorsSet.add(task.executor));
        return Array.from(executorsSet);
      })
    );
  }

}
