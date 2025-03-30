/**
 * CultureStream Accessibility Report Manager
 * Handles test results and renders accessibility reports in the dashboard
 */
const CSAccessibilityReport = (function() {
  let testResults = {
    passed: [],
    warnings: [],
    errors: [],
    summary: {
      total: 0,
      passed: 0,
      warnings: 0,
      errors: 0,
      wcagLevel: 'Unbekannt'
    },
    categories: {
      images: { passed: 0, warnings: 0, errors: 0 },
      headings: { passed: 0, warnings: 0, errors: 0 },
      links: { passed: 0, warnings: 0, errors: 0 },
      forms: { passed: 0, warnings: 0, errors: 0 },
      landmarks: { passed: 0, warnings: 0, errors: 0 },
      keyboard: { passed: 0, warnings: 0, errors: 0 },
      contrast: { passed: 0, warnings: 0, errors: 0 },
      aria: { passed: 0, warnings: 0, errors: 0 }
    },
    testedPages: []
  };

  const config = {
    reportContainer: '#accessibility-report',
    summaryContainer: '#accessibility-summary',
    categoryContainer: '#category-reports',
    statusColors: {
      passed: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    }
  };

  /**
   * Initializes the report dashboard
   */
  function init() {
    // Check if we're on the report page
    if (!document.querySelector(config.reportContainer)) return;
    
    // Load stored results if available
    loadStoredResults();
    
    // Render the report components
    renderSummary();
    renderCategoryReports();
    renderTestedPages();
    
    // Bind event listeners
    bindEvents();
    
    console.log('Accessibility Report Dashboard initialized');
  }
  
  /**
   * Binds event listeners for the report dashboard
   */
  function bindEvents() {
    // Scan page form submission
    const scanForm = document.getElementById('scan-page-form');
    if (scanForm) {
      scanForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const pageUrl = document.getElementById('page-url').value;
        if (pageUrl) {
          addPageToTest(pageUrl);
          document.getElementById('page-url').value = '';
        }
      });
    }
    
    // Category tab switching
    const tabs = document.querySelectorAll('.category-tab');
    if (tabs.length) {
      tabs.forEach(tab => {
        tab.addEventListener('click', function() {
          const category = this.getAttribute('data-category');
          showCategoryContent(category);
        });
      });
    }
    
    // Export results button
    const exportBtn = document.getElementById('export-results');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportResults);
    }
    
    // Clear results button
    const clearBtn = document.getElementById('clear-results');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearResults);
    }
  }
  
  /**
   * Shows the content for a specific category tab
   */
  function showCategoryContent(category) {
    // Hide all category contents
    document.querySelectorAll('.category-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show selected category content
    const selectedContent = document.querySelector(`.category-content[data-category="${category}"]`);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`.category-tab[data-category="${category}"]`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
  }
  
  /**
   * Renders the summary cards and progress bar
   */
  function renderSummary() {
    const summaryContainer = document.querySelector(config.summaryContainer);
    if (!summaryContainer) return;
    
    // Update summary counts
    document.getElementById('passed-count').textContent = testResults.summary.passed;
    document.getElementById('warnings-count').textContent = testResults.summary.warnings;
    document.getElementById('errors-count').textContent = testResults.summary.errors;
    document.getElementById('wcag-level').textContent = determineWcagLevel();
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      const totalTests = testResults.summary.total;
      const passedPercentage = totalTests > 0 ? Math.round((testResults.summary.passed / totalTests) * 100) : 0;
      progressBar.style.width = `${passedPercentage}%`;
      progressBar.setAttribute('aria-valuenow', passedPercentage);
      document.getElementById('progress-percentage').textContent = `${passedPercentage}%`;
    }
  }
  
  /**
   * Determines WCAG compliance level based on test results
   */
  function determineWcagLevel() {
    if (testResults.summary.errors === 0 && testResults.summary.warnings === 0) {
      return 'AAA';
    } else if (testResults.summary.errors === 0) {
      return 'AA';
    } else if (testResults.summary.errors <= 3) {
      return 'A';
    } else {
      return 'Nicht konform';
    }
  }
  
  /**
   * Renders category-specific reports
   */
  function renderCategoryReports() {
    const categoryContainer = document.querySelector(config.categoryContainer);
    if (!categoryContainer) return;
    
    // Populate category statistics
    Object.keys(testResults.categories).forEach(category => {
      const categoryStats = testResults.categories[category];
      const categorySection = document.querySelector(`.category-content[data-category="${category}"]`);
      
      if (categorySection) {
        // Update statistics
        const passedEl = categorySection.querySelector('.passed-count');
        const warningsEl = categorySection.querySelector('.warnings-count');
        const errorsEl = categorySection.querySelector('.errors-count');
        
        if (passedEl) passedEl.textContent = categoryStats.passed;
        if (warningsEl) warningsEl.textContent = categoryStats.warnings;
        if (errorsEl) errorsEl.textContent = categoryStats.errors;
        
        // Populate issues list
        const issuesList = categorySection.querySelector('.issues-list');
        if (issuesList) {
          issuesList.innerHTML = '';
          
          // Get all issues for this category
          const allIssues = []
            .concat(
              testResults.errors.filter(issue => issue.category === category)
                .map(issue => ({ ...issue, type: 'error' })),
              testResults.warnings.filter(issue => issue.category === category)
                .map(issue => ({ ...issue, type: 'warning' }))
            );
          
          if (allIssues.length === 0) {
            issuesList.innerHTML = '<li class="no-issues">Keine Probleme gefunden</li>';
          } else {
            allIssues.forEach(issue => {
              const issueItem = document.createElement('li');
              issueItem.className = `issue-item ${issue.type}`;
              issueItem.innerHTML = `
                <span class="issue-type ${issue.type}">
                  ${issue.type === 'error' ? 'Fehler' : 'Warnung'}
                </span>
                <div class="issue-content">
                  <h4>${issue.description}</h4>
                  <p>${issue.message}</p>
                  <code>${issue.element || 'N/A'}</code>
                  <div class="issue-location">
                    <span>Gefunden auf: ${issue.page || 'Aktuelle Seite'}</span>
                    ${issue.selector ? `<span>Selektor: ${issue.selector}</span>` : ''}
                  </div>
                </div>
              `;
              issuesList.appendChild(issueItem);
            });
          }
        }
      }
    });
    
    // Show the first category by default
    showCategoryContent('images');
  }
  
  /**
   * Renders the list of tested pages
   */
  function renderTestedPages() {
    const testedPagesContainer = document.getElementById('tested-pages-list');
    if (!testedPagesContainer) return;
    
    testedPagesContainer.innerHTML = '';
    
    if (testResults.testedPages.length === 0) {
      testedPagesContainer.innerHTML = '<li>Keine Seiten getestet</li>';
      return;
    }
    
    testResults.testedPages.forEach(page => {
      const pageItem = document.createElement('li');
      const statusClass = page.status === 'passed' ? 'success' :
                         page.status === 'warning' ? 'warning' : 'error';
      
      pageItem.className = `tested-page ${statusClass}`;
      pageItem.innerHTML = `
        <span class="page-url">${page.url}</span>
        <span class="page-status ${statusClass}">
          ${page.status === 'passed' ? 'Bestanden' : 
            page.status === 'warning' ? 'Warnungen' : 'Fehler'}
        </span>
        <span class="page-date">${page.date}</span>
      `;
      
      testedPagesContainer.appendChild(pageItem);
    });
  }
  
  /**
   * Adds a new page to the test queue
   */
  function addPageToTest(url) {
    // In a real implementation, this would trigger tests for the page
    // For this demonstration, we'll just add a mock result
    const mockResult = {
      url: url,
      date: new Date().toLocaleString(),
      status: ['passed', 'warning', 'error'][Math.floor(Math.random() * 3)]
    };
    
    testResults.testedPages.push(mockResult);
    saveResults();
    renderTestedPages();
    
    // Show notification
    showNotification(`Test für ${url} gestartet`);
  }
  
  /**
   * Shows a notification message
   */
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Schließen">×</button>
    `;
    
    // Add notification to container
    const container = document.querySelector('.notification-container');
    if (container) {
      container.appendChild(notification);
      
      // Bind close button
      notification.querySelector('.notification-close').addEventListener('click', function() {
        container.removeChild(notification);
      });
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode === container) {
          container.removeChild(notification);
        }
      }, 5000);
    }
  }
  
  /**
   * Exports the test results
   */
  function exportResults() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testResults, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "accessibility_report_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showNotification('Report exportiert', 'success');
  }
  
  /**
   * Clears all test results
   */
  function clearResults() {
    if (confirm('Alle Testergebnisse löschen?')) {
      testResults = {
        passed: [],
        warnings: [],
        errors: [],
        summary: {
          total: 0,
          passed: 0,
          warnings: 0,
          errors: 0,
          wcagLevel: 'Unbekannt'
        },
        categories: {
          images: { passed: 0, warnings: 0, errors: 0 },
          headings: { passed: 0, warnings: 0, errors: 0 },
          links: { passed: 0, warnings: 0, errors: 0 },
          forms: { passed: 0, warnings: 0, errors: 0 },
          landmarks: { passed: 0, warnings: 0, errors: 0 },
          keyboard: { passed: 0, warnings: 0, errors: 0 },
          contrast: { passed: 0, warnings: 0, errors: 0 },
          aria: { passed: 0, warnings: 0, errors: 0 }
        },
        testedPages: []
      };
      
      localStorage.removeItem('csAccessibilityResults');
      renderSummary();
      renderCategoryReports();
      renderTestedPages();
      showNotification('Alle Ergebnisse gelöscht', 'info');
    }
  }
  
  /**
   * Processes incoming test results from the test tool
   */
  function processTestResults(results) {
    // Update test results with new data
    testResults.passed = testResults.passed.concat(results.passed);
    testResults.warnings = testResults.warnings.concat(results.warnings);
    testResults.errors = testResults.errors.concat(results.errors);
    
    // Update summary
    testResults.summary.total = results.summary.total;
    testResults.summary.passed = results.summary.passed;
    testResults.summary.warnings = results.summary.warnings;
    testResults.summary.errors = results.summary.errors;
    
    // Update categories
    Object.keys(results.categories).forEach(category => {
      testResults.categories[category] = results.categories[category];
    });
    
    // Add tested page
    const pageResult = {
      url: window.location.href,
      date: new Date().toLocaleString(),
      status: results.summary.errors > 0 ? 'error' : 
              results.summary.warnings > 0 ? 'warning' : 'passed'
    };
    
    testResults.testedPages.push(pageResult);
    
    // Save results and update UI if on report page
    saveResults();
    if (document.querySelector(config.reportContainer)) {
      renderSummary();
      renderCategoryReports();
      renderTestedPages();
    }
  }
  
  /**
   * Saves results to localStorage
   */
  function saveResults() {
    try {
      localStorage.setItem('csAccessibilityResults', JSON.stringify(testResults));
    } catch (e) {
      console.error('Failed to save accessibility results:', e);
    }
  }
  
  /**
   * Loads results from localStorage
   */
  function loadStoredResults() {
    try {
      const storedResults = localStorage.getItem('csAccessibilityResults');
      if (storedResults) {
        testResults = JSON.parse(storedResults);
      }
    } catch (e) {
      console.error('Failed to load accessibility results:', e);
    }
  }

  // Listen for custom events from the test tool
  window.addEventListener('CSAccessibilityTestComplete', function(e) {
    processTestResults(e.detail);
  });
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);
  
  // Public API
  return {
    processTestResults,
    clearResults,
    exportResults
  };
})(); 