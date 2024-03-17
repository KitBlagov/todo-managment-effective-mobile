import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TodoService } from "../../services/todo.service";
import { NgForOf, NgIf } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlidePanelComponent } from '../../ui/slide-panel/slide-panel.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    SlidePanelComponent,
    NgIf,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  taskForm!: FormGroup;
  isSlidePanelOpen = false;
  isEditing = false;
  editingTaskId: number | null = null;
  expandedTaskId: number | null = null;

  constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.taskForm = this.formBuilder.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      deadline: [''],
      priority: [''],
      status: [''],
      executor: ['']
    });
  }

  loadTasks(): void {
    this.tasks = this.todoService.getTasks();
  }

  openSlidePanel(taskId: number | null = null): void {
    this.isSlidePanelOpen = true;
    this.isEditing = taskId !== null;
    this.editingTaskId = taskId;
    if (taskId !== null) {
      const taskToEdit = this.tasks.find(task => task.id === taskId);
      if (taskToEdit) {
        this.taskForm.patchValue(taskToEdit);
      }
    } else {
      this.taskForm.reset();
    }
  }

  onCloseSlidePanel(): void {
    this.isSlidePanelOpen = false;
    this.isEditing = false;
    this.editingTaskId = null;
    this.taskForm.reset();
  }

  submitTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData = this.taskForm.value;

    if (this.isEditing && taskData.id !== null) {
      this.todoService.updateTask(taskData);
    } else {
      this.todoService.addTask(taskData);
    }

    this.loadTasks();
    this.taskForm.reset();
    this.isSlidePanelOpen = false;
  }

  deleteTask(id: number): void {
    this.todoService.deleteTask(id);
    this.loadTasks();
  }

  toggleExpandTask(taskId: number): void {
    this.expandedTaskId = this.expandedTaskId === taskId ? null : taskId;
  }

  isTaskExpanded(taskId: number): boolean {
    return this.expandedTaskId === taskId;
  }

  goToTaskBoard(): void {
    this.router.navigate(['/task-board']);
  }


}

