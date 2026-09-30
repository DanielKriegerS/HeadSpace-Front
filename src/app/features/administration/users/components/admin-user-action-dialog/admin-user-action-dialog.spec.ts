import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUserActionDialog } from './admin-user-action-dialog';

describe('AdminUserActionDialog', () => {
  let component: AdminUserActionDialog;
  let fixture: ComponentFixture<AdminUserActionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserActionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserActionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
