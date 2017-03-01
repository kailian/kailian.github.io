// emoji
function addEmoji() {
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    window.location.hash = "🐉";
  }
}
addEmoji();

// Service Workers
if ('serviceWorker' in navigator && navigator.onLine) {
  // Attempt to register it
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });

  var currentPath = window.location.pathname;
  var cacheButton = document.querySelector('.offline-btn');

  var imageArray = document.querySelectorAll('img');
  // Event listener
  if(cacheButton) {
    cacheButton.addEventListener('click', function(event) {
      event.preventDefault();
      // Build an array of the page-specific resources.
      var pageResources = [currentPath];
      for (i = 0; i < imageArray.length; i++) {
        pageResources.push(imageArray[i].src);
      }
      // Open the unique cache for this URL.
      caches.open('offline-' + currentPath).then(function(cache) {
        var updateCache = cache.addAll(pageResources);

        // Update UI to indicate success.
        updateCache.then(function() {
          console.log('Article is now available offline.');
          cacheButton.innerHTML = "☺";
        });

        // Catch any errors and report.
        updateCache.catch(function (error) {
          console.log('Article could not be saved offline.');
          cacheButton.innerHTML = "☹";
        });
      });
    });
  }
}