import { useEffect, MutableRefObject, DependencyList } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useComponentLostFocus = (ref: MutableRefObject<any>, onLostFocus?: (...params: any) => any, deps?: DependencyList) => {

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onLostFocus && onLostFocus();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, deps]);
}
