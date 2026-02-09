import { closeSnackbar, enqueueSnackbar, type SnackbarKey } from '#context/snackbar';

import { CloseButton } from './close-button/close-button.tsx';
import { ServiceNotification } from './service-notification/service-notification.tsx';

export class FetchStatusError extends Error {
  public constructor(response: { status: number; statusText: string }) {
    super(`${response.status} ${response.statusText}`);
    this.name = 'FetchStatusError';

    const action = (key: SnackbarKey): React.ReactNode => (
      <CloseButton snackbarKey={key} closeSnackbar={closeSnackbar} />
    );

    enqueueSnackbar(<ServiceNotification err={this} />, {
      persist: false,
      variant: 'error',
      action: action,
    });
  }
}
