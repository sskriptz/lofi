export function applyDefaultTheme() {
    const systemTheme = getSystemThemePreference();
    appearancePanel.style.backgroundColor = systemTheme === 'dark' ? '#1e293b' : '#ffffff';
    document.body.style.backgroundColor = systemTheme === 'dark' ? '#0f172a' : '#f8fafc';
  }
  
  function getSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'default';
}
