import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

import { 
  RoleName
} from '../../../../../core/models/RoleName';

import {
  UserStatus
} from '../../../../../core/models/UserStatus';

import {
  AdminUserFilters
} from '../../administration-user.models';


export interface AdminUserFilterSelection {
  search?: string;
  status?: UserStatus;
  role?: RoleName;
  size: number;
}

interface AdminUserFilterForm {
  search: FormControl<string>;
  status: FormControl<UserStatus | ''>;
  role: FormControl<RoleName | ''>;
  size: FormControl<number>;
}

@Component({
  selector: 'app-admin-user-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-user-filters.html',
  styleUrl: './admin-user-filters.scss'
})
export class AdminUserFiltersComponent implements OnInit {
  readonly filters = input.required<AdminUserFilters>();

  readonly filtersChanged =
    output<AdminUserFilterSelection>();

  private readonly destroyRef = inject(DestroyRef);

  readonly form = new FormGroup<AdminUserFilterForm>({
    search: new FormControl('', {
      nonNullable: true
    }),

    status: new FormControl<UserStatus | ''>('', {
      nonNullable: true
    }),

    role: new FormControl<RoleName | ''>('', {
      nonNullable: true
    }),

    size: new FormControl(20, {
      nonNullable: true
    })
  });

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.form.patchValue(
        {
          search: filters.search ?? '',
          status: filters.status ?? '',
          role: filters.role ?? '',
          size: filters.size
        },
        {
          emitEvent: false
        }
      );
    });
  }

  ngOnInit(): void {
    this.observeSearch();
    this.observeImmediateFilters();
  }

  clearFilters(): void {
    this.form.reset(
      {
        search: '',
        status: '',
        role: '',
        size: 20
      },
      {
        emitEvent: false
      }
    );

    this.emitSelection();
  }

  private observeSearch(): void {
    this.form.controls.search.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.emitSelection();
      });
  }

  private observeImmediateFilters(): void {
    this.observeImmediateControl(
      this.form.controls.status
    );

    this.observeImmediateControl(
      this.form.controls.role
    );

    this.observeImmediateControl(
      this.form.controls.size
    );
  }

  private observeImmediateControl<T>(
    control: FormControl<T>
  ): void {
    control.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.emitSelection();
      });
  }

  private emitSelection(): void {
    const value = this.form.getRawValue();
    const normalizedSearch = value.search.trim();

    this.filtersChanged.emit({
      search: normalizedSearch || undefined,
      status: value.status || undefined,
      role: value.role || undefined,
      size: this.normalizePageSize(value.size)
    });
  }

  private normalizePageSize(size: number): number {
    const allowedSizes = [
      10,
      20,
      50
    ];

    return allowedSizes.includes(size)
      ? size
      : 20;
  }
}