export function getCurrentUrl(pathname: string) {
  return pathname.split(/[?#]/)[0];
}

export function checkIsActive(pathname: string, url: string) {
  const current = getCurrentUrl(pathname);

  if (!current || !url) {
    return false;
  }

  // Exact match
  if (current === url) {
    return true;
  }

  // Check if the current URL ends with the provided URL (optional)
  if (current.endsWith(url)) {
    return true;
  }

  return false;
}
