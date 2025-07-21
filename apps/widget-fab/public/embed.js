// Bubblle Chat Widget Embed Script
// This script creates an iframe with the chat widget

(function() {
  'use strict';

  // Configuration
  const WIDGET_URL = 'http://localhost:3002'; // This will be replaced with actual domain
  
  // Get script tag and extract configuration
  const scriptTag = document.currentScript || document.querySelector('script[data-client]');
  if (!scriptTag) {
    console.error('Bubblle Chat: Script tag not found');
    return;
  }

  const config = {
    client: scriptTag.getAttribute('data-client'),
    agent: scriptTag.getAttribute('data-agent'),
    position: scriptTag.getAttribute('data-position') || 'bottom-right',
    theme: scriptTag.getAttribute('data-theme') || 'auto',
    color: scriptTag.getAttribute('data-color'),
    title: scriptTag.getAttribute('data-title'),
    subtitle: scriptTag.getAttribute('data-subtitle'),
    avatar: scriptTag.getAttribute('data-avatar'),
  };

  // Validate required config
  if (!config.client || !config.agent) {
    console.error('Bubblle Chat: Missing required data-client or data-agent attributes');
    return;
  }

  // Build widget URL with parameters
  const params = new URLSearchParams();
  Object.entries(config).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const widgetUrl = `${WIDGET_URL}/embed?${params.toString()}`;

  // Create iframe container
  const container = document.createElement('div');
  container.id = 'bubblle-chat-widget';
  container.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
  `;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = widgetUrl;
  iframe.style.cssText = `
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    background: transparent !important;
    pointer-events: auto !important;
  `;
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');

  // Add iframe to container
  container.appendChild(iframe);

  // Add container to page
  function addWidget() {
    if (document.body) {
      document.body.appendChild(container);
    } else {
      // Wait for body to be available
      setTimeout(addWidget, 10);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWidget);
  } else {
    addWidget();
  }

  // Message handling between iframe and parent
  window.addEventListener('message', function(event) {
    if (event.origin !== WIDGET_URL) return;

    switch (event.data.type) {
      case 'bubblle-resize':
        // Handle resize if needed
        break;
      case 'bubblle-close':
        // Handle close if needed
        break;
      case 'bubblle-notification':
        // Handle notifications
        if (event.data.title && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(event.data.title, {
            body: event.data.message,
            icon: event.data.icon || '/favicon.ico'
          });
        }
        break;
    }
  });

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  console.log('Bubblle Chat Widget loaded successfully');
})();