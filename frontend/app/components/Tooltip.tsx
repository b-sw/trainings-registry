import {
    autoUpdate,
    flip,
    offset,
    safePolygon,
    shift,
    useDismiss,
    useFloating,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react';
import { useState, type ReactNode } from 'react';

interface TooltipProps {
    label: string;
    children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
    const [open, setOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        placement: 'top',
        middleware: [offset(8), flip(), shift()],
    });

    const hover = useHover(context, { handleClose: safePolygon() });
    const role = useRole(context, { role: 'tooltip' });
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, role, dismiss]);

    return (
        <>
            <span ref={refs.setReference} {...getReferenceProps()} className="inline-block">
                {children}
            </span>

            {open && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className="z-50 rounded-md bg-gray-900 text-white text-xs px-2 py-1 shadow-lg"
                >
                    {label}
                </div>
            )}
        </>
    );
}
