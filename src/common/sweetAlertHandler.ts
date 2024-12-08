import Swal, { SweetAlertIcon } from 'sweetalert2';

export const sweetAlertHandler = async (
    title: string,
    message: string,
    icon: SweetAlertIcon,
    callbackCancel: () => void,
    callbackConfirm: () => void,
    isDeletion: boolean
): Promise<void> => {
    if (isDeletion) {
        const result = await Swal.fire({
            title,
            text: message,
            icon,
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            callbackConfirm();
        }
        else {
            callbackCancel();
        }
    } else {
        await Swal.fire({
            title,
            text: message,
            icon,
            confirmButtonText: 'OK',
        });
        callbackConfirm();
    }
};
