import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserFilters } from './admin-user-filters';

describe('AdminUserFilters', () => {
  let component: AdminUserFilters;
  let fixture: ComponentFixture<AdminUserFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
