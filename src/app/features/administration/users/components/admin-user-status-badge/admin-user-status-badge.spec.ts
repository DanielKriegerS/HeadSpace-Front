import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserStatusBadge } from './admin-user-status-badge';

describe('AdminUserStatusBadge', () => {
  let component: AdminUserStatusBadge;
  let fixture: ComponentFixture<AdminUserStatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserStatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserStatusBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
