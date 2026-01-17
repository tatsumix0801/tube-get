// キャッシュを無効化するためのスクリプト
(function() {
  // バージョン番号（デプロイ時に毎回更新される値）
  const version = new Date().getTime();
  
  // ページロード時にキャッシュをクリアする
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName);
      });
    });
  }
  
  // localStorage にバージョン情報を保存
  localStorage.setItem('app_version', version.toString());
  
  console.log('Cache cleared. Version: ' + version);
})(); 