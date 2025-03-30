/**
 * CultureStream Accessibility Test Integration
 * Integrates the accessibility testing tool with the reporting dashboard
 */
(function() {
  // Configuration
  const config = {
    autoRunTests: true,
    reportUrl: '/accessibility-report.html',
    testDelay: 1500, // ms to wait before running tests after page load
    notificationsEnabled: true
  };
  
  /**
   * Initialize the integration
   */
  function init() {
    // Make sure both required scripts are loaded
    if (typeof CSAccessibilityTest === 'undefined' || typeof CSAccessibilityReport === 'undefined') {
      console.warn('Accessibility test or report script not loaded. Integration disabled.');
      return;
    }
    
    // Add report link to test feedback panel
    addReportLink();
    
    // Run tests automatically if configured
    if (config.autoRunTests) {
      setTimeout(runTests, config.testDelay);
    }
    
    // Add test button to the page
    addTestButton();
  }
  
  /**
   * Run accessibility tests and process results
   */
  function runTests() {
    // Configure test options
    const testOptions = {
      showVisualFeedback: true,
      includeWarnings: true,
      wcagLevel: 'AA'
    };
    
    // Run tests
    CSAccessibilityTest.runTests(testOptions)
      .then(results => {
        // Send results to report
        CSAccessibilityReport.processTestResults(results);
        
        // Show notification with summary
        if (config.notificationsEnabled) {
          showTestCompletionNotification(results);
        }
      })
      .catch(err => {
        console.error('Error running accessibility tests:', err);
      });
  }
  
  /**
   * Add a link to the full report in the test feedback panel
   */
  function addReportLink() {
    const feedbackPanel = document.querySelector('.cs-a11y-feedback');
    if (!feedbackPanel) {
      setTimeout(addReportLink, 500); // Try again if panel isn't created yet
      return;
    }
    
    const reportLink = document.createElement('a');
    reportLink.href = config.reportUrl;
    reportLink.className = 'cs-a11y-report-link';
    reportLink.textContent = 'Vollständigen Accessibility Report anzeigen';
    reportLink.setAttribute('target', '_blank');
    
    feedbackPanel.appendChild(reportLink);
  }
  
  /**
   * Add a floating button to run the accessibility tests
   */
  function addTestButton() {
    // Create button element
    const button = document.createElement('button');
    button.id = 'cs-a11y-test-button';
    button.setAttribute('aria-label', 'Accessibility Test starten');
    button.innerHTML = '<span class="icon">♿</span> Test';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #cs-a11y-test-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #0066cc;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 8px 16px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
      }
      #cs-a11y-test-button:hover {
        background-color: #0052a3;
      }
      #cs-a11y-test-button .icon {
        margin-right: 6px;
        font-size: 1.2em;
      }
      @media (max-width: 768px) {
        #cs-a11y-test-button {
          padding: 6px 12px;
          font-size: 0.9em;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(button);
    
    // Add event listener
    button.addEventListener('click', () => {
      button.disabled = true;
      button.innerHTML = '<span class="icon">⏳</span> Testing...';
      
      runTests();
      
      // Re-enable button after 3 seconds
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = '<span class="icon">♿</span> Test';
      }, 3000);
    });
  }
  
  /**
   * Show a notification with test completion results
   */
  function showTestCompletionNotification(results) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 350px;
        }
        .notification {
          background-color: white;
          border-left: 4px solid #0066cc;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          margin-bottom: 10px;
          padding: 15px;
          transition: all 0.3s ease;
          animation: slideIn 0.3s ease forwards;
        }
        .notification.success { border-left-color: #28a745; }
        .notification.error { border-left-color: #dc3545; }
        .notification.warning { border-left-color: #ffc107; }
        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .notification-title {
          font-weight: bold;
          margin: 0;
        }
        .notification-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2em;
          padding: 0;
          margin: 0;
          line-height: 1;
        }
        .notification-message {
          font-size: 0.9em;
        }
        @keyframes slideIn {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Determine notification type
    let notificationType = 'info';
    if (results.summary.errors > 0) {
      notificationType = 'error';
    } else if (results.summary.warnings > 0) {
      notificationType = 'warning';
    } else {
      notificationType = 'success';
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${notificationType}`;
    notification.innerHTML = `
      <div class="notification-header">
        <h4 class="notification-title">Accessibility Test abgeschlossen</h4>
        <button class="notification-close" aria-label="Schließen">×</button>
      </div>
      <div class="notification-message">
        <p>Zusammenfassung:</p>
        <ul>
          <li>✅ Bestanden: ${results.summary.passed}</li>
          <li>⚠️ Warnungen: ${results.summary.warnings}</li>
          <li>❌ Fehler: ${results.summary.errors}</li>
        </ul>
        <a href="${config.reportUrl}" target="_blank">Details im vollständigen Report anzeigen</a>
      </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      container.removeChild(notification);
    });
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (notification.parentNode === container) {
        container.removeChild(notification);
      }
    }, 8000);
  }
  
  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 