document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('apkForm');
    const iconInput = document.getElementById('icon');
    const buildButton = document.getElementById('buildButton');
    const buildStatus = document.getElementById('buildStatus');
    const buildResult = document.getElementById('buildResult');
    const statusMessage = document.getElementById('statusMessage');
    const downloadLink = document.getElementById('downloadLink');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const estimatedTimeEl = document.getElementById('estimatedTime');
    
    // Progress bar management
    let buildStartTime = null;
    let estimatedTotalTime = 0;
    let progressUpdateInterval = null;
    
    function ensureProgressBarElements() {
        // Force re-query elements to ensure they're found
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        const time = document.getElementById('estimatedTime');
        
        return {
            fill: fill,
            text: text,
            time: time
        };
    }
    
    function initProgressBar() {
        buildStartTime = Date.now();
        const elements = ensureProgressBarElements();
        
        // Set initial values with fallback
        if (elements.fill && elements.fill.style) {
            elements.fill.style.width = '0%';
            console.log('Progress bar: fill element found');
        } else {
            console.log('Progress bar: fill element NOT found');
        }
        
        if (elements.text && elements.text.textContent !== undefined) {
            elements.text.textContent = 'Preparing build...';
            console.log('Progress bar: text element found');
        } else {
            console.log('Progress bar: text element NOT found');
        }
        
        if (elements.time && elements.time.textContent !== undefined) {
            elements.time.textContent = 'Estimated time: 5 minutes';
            console.log('Progress bar: time element found');
        } else {
            console.log('Progress bar: time element NOT found');
        }
        
        // Start immediate updates
        updateProgressBar();
        
        // Set up interval to ensure continuous updates
        clearInterval(progressUpdateInterval);
        progressUpdateInterval = setInterval(() => {
            updateProgressBar();
        }, 3000); // Update every 3 seconds
    }
    
    function updateProgressBar() {
        if (!buildStartTime) {
            console.log('Progress bar: buildStartTime not set');
            return;
        }
        
        const elements = ensureProgressBarElements();
        const statusMessage = document.getElementById('statusMessage');
        const elapsed = Date.now() - buildStartTime;
        let progressPercent = 0;
        let estimatedTimeText = '';
        let progressText = '';
        
        // Parse the actual status message to determine stage
        const currentStatus = statusMessage ? statusMessage.textContent.toLowerCase() : '';
        
        if (currentStatus.includes('finalizing') || currentStatus.includes('approximately 3 minutes')) {
            // Finalizing stage - nearly done
            progressPercent = 90;
            estimatedTimeText = `Finalizing APK: approximately 3 minutes remaining`;
            progressText = `Finalizing APK...`;
        } else if (currentStatus.includes('building') || currentStatus.includes('building your apk') || currentStatus.includes('compile')) {
            // Building stage - APK compilation
            progressPercent = Math.min(40 + (elapsed / (4 * 60 * 1000)) * 50, 90); // 40-90%
            const remainingMinutes = Math.max(2, Math.ceil((5 * 60 * 1000 - elapsed) / 60000));
            estimatedTimeText = `Building APK: approximately ${remainingMinutes} minutes remaining`;
            progressText = `Building APK...`;
        } else if (currentStatus.includes('position') || currentStatus.includes('queue') || currentStatus.includes('waiting')) {
            // Queue stage - waiting to start
            progressPercent = Math.min((elapsed / (3 * 60 * 1000)) * 40, 40); // 0-40%
            const remainingMinutes = Math.max(1, Math.ceil((3 * 60 * 1000 - elapsed) / 60000));
            estimatedTimeText = `Waiting in queue: ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} remaining`;
            progressText = `Waiting in queue...`;
        } else {
            // Default fallback
            progressPercent = Math.min((elapsed / (5 * 60 * 1000)) * 80, 80);
            estimatedTimeText = `Building in progress: ${Math.max(1, Math.ceil((5 * 60 * 1000 - elapsed) / 60000))} minutes remaining`;
            progressText = `Building...`;
        }
        
        // Update the UI elements with comprehensive checks
        if (elements.fill && elements.fill.style) {
            elements.fill.style.width = Math.min(progressPercent, 95) + '%';
        }
        
        if (elements.time && elements.time.textContent !== undefined) {
            elements.time.textContent = estimatedTimeText;
        }
        
        if (elements.text && elements.text.textContent !== undefined) {
            elements.text.textContent = progressText;
        }
    }
    
    function completeProgressBar() {
        clearInterval(progressUpdateInterval); // Stop updates
        
        const elements = ensureProgressBarElements();
        if (elements.fill && elements.fill.style) {
            elements.fill.style.width = '100%';
        }
        if (elements.text && elements.text.textContent !== undefined) {
            elements.text.textContent = 'Build completed!';
        }
        if (elements.time && elements.time.textContent !== undefined) {
            elements.time.textContent = 'APK ready for download';
        }
        
        // Reset after a delay
        setTimeout(() => {
            if (elements.fill && elements.fill.style) {
                elements.fill.style.width = '0%';
            }
            buildStartTime = null;
        }, 2000);
    }
    
    // File upload preview
    iconInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const placeholder = document.querySelector('.file-upload-placeholder');
        const preview = document.querySelector('.file-upload-preview');
        const previewImg = document.getElementById('iconPreview');
        const fileName = document.getElementById('fileName');
        
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                iconInput.value = '';
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                iconInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                fileName.textContent = file.name;
                placeholder.classList.add('hidden');
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            placeholder.classList.remove('hidden');
            preview.classList.add('hidden');
        }
    });
    
    // Generate package name from app name
    document.getElementById('appName').addEventListener('input', function(e) {
        const appName = e.target.value.trim();
        const packageNameInput = document.getElementById('packageName');
        
        if (appName && !packageNameInput.value) {
            // Generate a basic package name suggestion
            const sanitized = appName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '');
            packageNameInput.value = `com.example.${sanitized}`;
        }
    });
    
    // Form validation
    function validateForm() {
        const websiteUrl = document.getElementById('websiteUrl').value;
        const appName = document.getElementById('appName').value;
        const packageName = document.getElementById('packageName').value;
        const versionName = document.getElementById('versionName').value;
        const versionCode = document.getElementById('versionCode').value;
        const icon = iconInput.files[0];
        
        // URL validation
        try {
            new URL(websiteUrl);
        } catch {
            alert('Please enter a valid website URL');
            return false;
        }
        
        // Package name validation
        const packageRegex = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)+$/;
        if (!packageRegex.test(packageName)) {
            alert('Package name must be in format: com.example.app');
            return false;
        }
        
        // Version name validation
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(versionName)) {
            alert('Version name must be in format: 1.0.0');
            return false;
        }
        
        // Version code validation
        if (!versionCode || parseInt(versionCode) < 1) {
            alert('Version code must be a positive integer');
            return false;
        }
        
        // Icon validation
        if (!icon) {
            alert('Please select an app icon');
            return false;
        }
        
        if (icon.size > 5 * 1024 * 1024) {
            alert('Icon file size must be less than 5MB');
            return false;
        }
        
        if (!icon.type.startsWith('image/')) {
            alert('Please select a valid image file for the icon');
            return false;
        }
        
        // App name length check
        if (appName.length > 30) {
            alert('App name must be 30 characters or less');
            return false;
        }
        
        return true;
    }
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        form.classList.add('hidden');
        buildResult.classList.add('hidden');
        buildStatus.classList.remove('hidden');
        initProgressBar(); // This will now call updateProgressBar internally
        
        statusMessage.textContent = 'Building your APK...';
        
        
        try {
            const formData = new FormData(form);
            
            // Add progress simulation
            const progressMessages = [
                'Initializing project structure...',
                'Generating Android manifest...',
                'Processing app icon...',
                'Creating WebView components...',
                'Building project files...',
                'Compiling Android code...',
                'Building APK...',
                'Finalizing APK...'
            ];
            
            let messageIndex = 0;
            const progressInterval = setInterval(() => {
                if (messageIndex < progressMessages.length) {
                    statusMessage.textContent = progressMessages[messageIndex];
                    messageIndex++;
                }
            }, 2000);
            
            const response = await fetch('/api/build-apk', {
                method: 'POST',
                body: formData
            });
            
            clearInterval(progressInterval);
            
            // Get response text first, then try to parse as JSON
            const responseText = await response.text();
            console.log('Server response:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('Failed to parse JSON response:', jsonError);
                console.error('Raw response:', responseText);
                throw new Error(`Server returned invalid response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
            }
            
            if (response.ok) {
                if (result.queued) {
                    // Handle queued response
                    const estimatedMinutes = Math.ceil(result.estimatedWaitTime / 60000);
                    const buildTimeMinutes = Math.ceil(result.estimatedBuildTime / 60000);
                    
                    statusMessage.innerHTML = `
                        <div style="text-align: center;">
                            <div style="font-size: 1.1em; margin-bottom: 10px;">
                                📋 Build queued - Position ${result.position} in queue
                            </div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                                ⏱️ Estimated total time: ${estimatedMinutes} minutes
                            </div>
                            <div style="font-size: 0.8em; color: #888; margin-bottom: 8px;">
                                🔨 Build time: ${buildTimeMinutes} minutes (typically 3-6 minutes, up to 15 minutes on slower servers)
                            </div>
                            <div style="font-size: 0.8em; color: #888;">
                                ${result.queueInfo.currentBuilds}/${result.queueInfo.maxConcurrent} builds running
                            </div>
                        </div>
                    `;
                    
                    // Start polling for status updates
                    pollBuildStatus(result.projectId);
                    
                    // Initialize progress bar immediately with server-provided estimate
                    if (result.estimatedWaitTime) {
                        updateProgressBar();
                    }
                } else if (result.success) {
                    // Handle immediate success (should be rare with queue system)
                    completeProgressBar();
                    handleBuildSuccess(result);
                } else {
                    throw new Error(result.error || 'Failed to build APK');
                }
            } else {
                throw new Error(result.error || `HTTP ${response.status}: ${responseText.substring(0, 200)}`);
            }
            
        } catch (error) {
            console.error('Build error:', error);
            
            // Hide Ko-fi widget on error
            hideKofiWidget();
            
            // Show error state
            buildStatus.classList.add('hidden');
            form.classList.remove('hidden');
            
            alert(`Error: ${error.message}`);
        }
    });
    
    // Download link click tracking
    downloadLink.addEventListener('click', function() {
        // Track download for analytics (if needed)
        console.log('APK download initiated');
        
        // Show appreciation message after download
        setTimeout(() => {
            const donateSection = document.querySelector('.success-donate');
            if (donateSection) {
                donateSection.style.animation = 'pulse 2s ease-in-out';
            }
        }, 1000);
        
        // Reset form after successful download
        setTimeout(() => {
            buildResult.classList.add('hidden');
            form.classList.remove('hidden');
            form.reset();
            
            // Reset file upload preview
            document.querySelector('.file-upload-placeholder').classList.remove('hidden');
            document.querySelector('.file-upload-preview').classList.add('hidden');
        }, 5000); // Increased time to show donate button longer
    });
    
    // Real-time input validation and formatting
    document.getElementById('packageName').addEventListener('input', function(e) {
        const value = e.target.value;
        const regex = /^[a-zA-Z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9]*)*$/;
        
        if (value && !regex.test(value)) {
            e.target.style.borderColor = '#ef4444';
        } else {
            e.target.style.borderColor = '#e5e7eb';
        }
    });
    
    document.getElementById('versionName').addEventListener('input', function(e) {
        const value = e.target.value;
        const regex = /^\d+\.\d+\.\d+$/;
        
        if (value && !regex.test(value)) {
            e.target.style.borderColor = '#ef4444';
        } else {
            e.target.style.borderColor = '#e5e7eb';
        }
    });
    
    document.getElementById('websiteUrl').addEventListener('input', function(e) {
        const value = e.target.value;
        
        if (value) {
            try {
                new URL(value);
                e.target.style.borderColor = '#e5e7eb';
            } catch {
                e.target.style.borderColor = '#ef4444';
            }
        } else {
            e.target.style.borderColor = '#e5e7eb';
        }
    });
    
    // Auto-fill version code when version name changes
    document.getElementById('versionName').addEventListener('change', function(e) {
        const versionName = e.target.value;
        const versionCodeInput = document.getElementById('versionCode');
        
        if (versionName && !versionCodeInput.value) {
            // Generate version code from version name (e.g., "1.2.3" -> 123)
            const parts = versionName.split('.');
            if (parts.length === 3) {
                const major = parseInt(parts[0]) || 0;
                const minor = parseInt(parts[1]) || 0;
                const patch = parseInt(parts[2]) || 0;
                const versionCode = major * 10000 + minor * 100 + patch;
                versionCodeInput.value = versionCode;
            }
        }
    });
    
    // Drag and drop for icon upload
    const fileUploadDisplay = document.querySelector('.file-upload-display');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadDisplay.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadDisplay.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadDisplay.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadDisplay.style.borderColor = '#667eea';
        fileUploadDisplay.style.backgroundColor = '#f3f4f6';
    }
    
    function unhighlight() {
        fileUploadDisplay.style.borderColor = '#d1d5db';
        fileUploadDisplay.style.backgroundColor = '#f9fafb';
    }
    
    fileUploadDisplay.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            iconInput.files = files;
            iconInput.dispatchEvent(new Event('change'));
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (!buildStatus.classList.contains('hidden')) return;
            
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });
    
    
    function hideKofiWidget() {
        const widget = document.getElementById('floatingKofi');
        if (widget && !widget.classList.contains('hidden')) {
            widget.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => {
                widget.classList.add('hidden');
                widget.style.animation = '';
            }, 500);
        }
    }
    
    // Build status polling
    function pollBuildStatus(projectId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/build-status/${projectId}`);
                const responseText = await response.text();
                
                let status;
                try {
                    status = JSON.parse(responseText);
                } catch (jsonError) {
                    clearInterval(pollInterval);
                    console.error('Failed to parse status JSON:', jsonError);
                    throw new Error(`Invalid status response: ${responseText}`);
                }
                
                if (!response.ok) {
                    clearInterval(pollInterval);
                    throw new Error(status.error || 'Failed to get build status');
                }
                
                // Update status message and progress bar
                if (status.status === 'queued') {
                    const estimatedMinutes = Math.ceil(status.estimatedTimeRemaining / 60000);
                    statusMessage.innerHTML = `
                        <div style="text-align: center;">
                            <div style="font-size: 1.1em; margin-bottom: 10px;">
                                📋 Position ${status.position} in queue
                            </div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                                ⏱️ Estimated wait time: ${estimatedMinutes} minutes
                            </div>
                            <div style="font-size: 0.8em; color: #888; margin-bottom: 8px;">
                                🔨 Build time: 3-6 minutes (typically 4.5 minutes, up to 15 minutes on slower servers)
                            </div>
                            <div style="font-size: 0.8em; color: #888;">
                                ${status.queueInfo.currentBuilds}/${status.queueInfo.maxConcurrent} builds running
                            </div>
                        </div>
                    `;
                    updateProgressBar();
                } else if (status.status === 'building') {
                    statusMessage.innerHTML = `
                        <div style="text-align: center;">
                            <div style="font-size: 1.1em; margin-bottom: 10px;">
                                🔨 Building your APK...
                            </div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                                ⏱️ Estimated time remaining: 3-6 minutes
                            </div>
                            <div style="font-size: 0.8em; color: #888;">
                                Please wait while we compile your app...
                            </div>
                        </div>
                    `;
                    updateProgressBar();
                } else if (status.status === 'completed') {
                    clearInterval(pollInterval);
                    completeProgressBar();
                    handleBuildSuccess({
                        success: true,
                        downloadUrl: `/download/${projectId}.apk`,
                        buildTime: status.completedAt - status.startedAt
                    });
                } else if (status.status === 'failed') {
                    clearInterval(pollInterval);
                    clearInterval(progressUpdateInterval); // Stop progress updates
                    throw new Error(status.error || 'Build failed');
                }
                
            } catch (error) {
                clearInterval(pollInterval);
                clearInterval(progressUpdateInterval); // Stop progress updates
                console.error('Status polling error:', error);
                
                // Show error state
                buildStatus.classList.add('hidden');
                form.classList.remove('hidden');
                alert(`Error: ${error.message}`);
            }
        }, 2000); // Poll every 2 seconds
        
        // Stop polling after 10 minutes to prevent infinite polling
        setTimeout(() => {
            clearInterval(pollInterval);
        }, 10 * 60 * 1000);
    }
    
    // Handle successful build completion
    function handleBuildSuccess(result) {
        // Hide Ko-fi widget when build completes
        hideKofiWidget();
        
        // Show success result
        buildStatus.classList.add('hidden');
        buildResult.classList.remove('hidden');
        downloadLink.href = result.downloadUrl;
        
        // Update message based on whether it's APK or fallback project
        const resultTitle = document.querySelector('.result-success h3');
        const resultMessage = document.querySelector('.result-success p');
        const downloadButtonText = downloadLink.querySelector('span') || downloadLink;
        
        // Always show success message for APK builds
        resultTitle.textContent = 'APK Generated Successfully!';
        resultMessage.textContent = 'Your APK has been built and is ready for download and installation.';
        downloadButtonText.textContent = 'Download APK';
        
        // Show build time if available
        if (result.buildTime) {
            const buildTimeInfo = document.createElement('div');
            buildTimeInfo.style.cssText = 'font-size: 0.9em; color: #666; margin-top: 10px;';
            buildTimeInfo.textContent = `Build completed in ${Math.round(result.buildTime / 1000)} seconds`;
            resultMessage.after(buildTimeInfo);
        }
        
        // Auto-download after a short delay
        setTimeout(() => {
            window.location.href = result.downloadUrl;
        }, 1000);
    }

    // Global function for close button
    window.closeKofiWidget = function() {
        hideKofiWidget();
    };
    
    // Queue status monitoring
    async function updateQueueStatus() {
        try {
            const response = await fetch('/api/queue-status');
            const queueInfo = await response.json();
            
            const queueStatusDiv = document.getElementById('queueStatus');
            if (queueStatusDiv) {
                queueStatusDiv.innerHTML = `
                    <div class="queue-item">
                        <i class="fas fa-cogs"></i>
                        <span>Active builds: ${queueInfo.currentBuilds}/${queueInfo.maxConcurrent}</span>
                    </div>
                    <div class="queue-item">
                        <i class="fas fa-clock"></i>
                        <span>Queued builds: ${queueInfo.queueLength}</span>
                    </div>
                    <div class="queue-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Total requests: ${queueInfo.totalActiveRequests}</span>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Failed to update queue status:', error);
            const queueStatusDiv = document.getElementById('queueStatus');
            if (queueStatusDiv) {
                queueStatusDiv.innerHTML = `
                    <div class="queue-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Unable to load queue status</span>
                    </div>
                `;
            }
        }
    }
    
    // Update queue status on page load and every 10 seconds
    updateQueueStatus();
    setInterval(updateQueueStatus, 10000);

    // Set default values
    document.getElementById('versionName').value = '1.0.0';
    document.getElementById('versionCode').value = '1';
});
