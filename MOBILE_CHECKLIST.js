// Mobile Features Checklist
// ===========================

const MOBILE_FEATURES = {
  navigation: {
    hamburgerMenu: '✅ Toggle sidebar на мобильных (≤768px)',
    overlayClose: '✅ Overlay для закрытия меню',
    escapeKey: '✅ Закрытие по Escape',
    autoClose: '✅ Автозакрытие при клике на link',
  },

  header: {
    mobileHeader: '✅ Fixed header на мобильных (60px высота)',
    logo: "✅ Logo 'Q&A Hub' в header",
    hamburgerButton: '✅ Кнопка ☰ для управления',
  },

  responsiveness: {
    desktopLayout: '✅ 2 колонки, sidebar 280px (>768px)',
    tabletLayout: '✅ Drawer menu, 1-2 колонки (480-768px)',
    mobileLayout: '✅ 1 колонка, полноэкранное меню (<480px)',
  },

  components: {
    categoryCard: '✅ Адаптивный padding и font-size',
    questionItem: '✅ Вертикальный layout на мобильных',
    searchModal: '✅ Fullscreen modal на <480px',
    questionDetail: '✅ Читаемые font-sizes для кода',
  },

  optimization: {
    touchScrolling: '✅ -webkit-overflow-scrolling: touch',
    buttonSizes: '✅ Touch-friendly кнопки (≥44px)',
    fontSize: '✅ Читаемый текст на мобильных',
    spacing: '✅ Адекватные gaps и paddings',
  },

  performance: {
    cssSize: '✅ +6.15KB мобильных стилей',
    gzipOptimized: '✅ Хорошо сжимается с gzip',
    noJSBloat: '✅ JS размер почти не вырос',
  },

  testing: {
    devTools: '✅ Протестировано в Chrome DevTools',
    breakpoints: '✅ 3 breakpoint: desktop/tablet/mobile',
    animations: '✅ Smooth transitions 0.3s',
  },
};

// Usage:
// npm run dev   → http://localhost:5174/
// F12 → Ctrl+Shift+M → Select device

export default MOBILE_FEATURES;
