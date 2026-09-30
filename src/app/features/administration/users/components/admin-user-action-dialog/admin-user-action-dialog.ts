import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild
} from '@angular/core';

export type AdminUserAction =
  | 'BAN'
  | 'UNBAN';

@Component({
  selector: 'app-admin-user-action-dialog',
  standalone: true,
  templateUrl: './admin-user-action-dialog.html',
  styleUrl: './admin-user-action-dialog.scss'
})
export class AdminUserActionDialog implements AfterViewInit {
  readonly action = input.required<AdminUserAction>();
  readonly username = input.required<string>();
  readonly actionInProgress = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>(
      'dialog'
    );

  private readonly cancelButton =
    viewChild.required<ElementRef<HTMLButtonElement>>(
      'cancelButton'
    );

  get isBanAction(): boolean {
    return this.action() === 'BAN';
  }

  get title(): string {
    return this.isBanAction
      ? 'Banir usuário?'
      : 'Desbanir usuário?';
  }

  get confirmationLabel(): string {
    return this.isBanAction
      ? 'Confirmar banimento'
      : 'Confirmar desbanimento';
  }

  ngAfterViewInit(): void {
    const dialog = this.dialog().nativeElement;

    if (!dialog.open) {
      dialog.showModal();
    }

    queueMicrotask(() => {
      this.cancelButton().nativeElement.focus();
    });
  }

  confirm(): void {
    if (this.actionInProgress()) {
      return;
    }

    this.confirmed.emit();
  }

  cancel(): void {
    if (this.actionInProgress()) {
      return;
    }

    this.closeDialog();
    this.cancelled.emit();
  }

  onNativeCancel(event: Event): void {
    event.preventDefault();

    this.cancel();
  }

  onBackdropClick(event: MouseEvent): void {
    if (
      this.actionInProgress() ||
      event.target !== this.dialog().nativeElement
    ) {
      return;
    }

    this.cancel();
  }

  private closeDialog(): void {
    const dialog = this.dialog().nativeElement;

    if (dialog.open) {
      dialog.close();
    }
  }
}