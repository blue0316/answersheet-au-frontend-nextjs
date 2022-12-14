import { useEffect, useRef } from "react";

function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return null;
        function tick() {
            if (!savedCallback?.current) return null;
            savedCallback.current();
        }
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

export default useInterval;
