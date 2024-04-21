export function debounce(func: (value: string) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (value: string) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(value);
    }, wait)
  }
}
