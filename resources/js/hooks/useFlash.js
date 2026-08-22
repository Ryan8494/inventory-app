import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function useFlash() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('info');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
        } else if (flash?.warning) {
            setMessage(flash.warning);
            setType('warning');
        } else if (flash?.message) {
            setMessage(flash.message);
            setType('info');
        }
    }, [flash]);

    const dismiss = () => setMessage(null);

    return { message, type, dismiss };
}
