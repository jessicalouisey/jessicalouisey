document.addEventListener("DOMContentLoaded", function() {
    // Get all windows
    const windows = document.querySelectorAll(".window");

    windows.forEach(win => {
        let isDragging = false;
        let offsetX, offsetY;
        let isResizing = false;
        let initialWidth, initialHeight, initialMouseX, initialMouseY;

        // Drag functionality for windows
        win.querySelector(".window-header").addEventListener("mousedown", function(e) {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });

        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                win.style.left = e.clientX - offsetX + "px";
                win.style.top = e.clientY - offsetY + "px";
            }

            if (isResizing) {
                const deltaX = e.clientX - initialMouseX;
                const deltaY = e.clientY - initialMouseY;

                win.style.width = initialWidth + deltaX + "px";
                win.style.height = initialHeight + deltaY + "px";
            }
        });

        // Reset dragging and resizing when mouse is released
        document.addEventListener("mouseup", function() {
            isDragging = false;
            isResizing = false;  // Stop resizing when mouse is released
        });

        // Close button functionality
        win.querySelector(".close-btn").addEventListener("click", function() {
            window.history.back();
        });

        // Resize handle functionality
        win.querySelector(".resize-handle").addEventListener("mousedown", function(e) {
            isResizing = true;
            initialWidth = win.offsetWidth;
            initialHeight = win.offsetHeight;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            e.preventDefault();
        });

        // Minimize button functionality
        win.querySelector(".minimize-btn").addEventListener("click", function() {
            win.classList.toggle('minimized');
        });

        // Maximize button functionality
        win.querySelector(".maximize-btn").addEventListener("click", function() {
            win.classList.toggle('maximized');
        });
    });
});
//desktop icon movement
document.addEventListener("DOMContentLoaded", function () {
    const icons = document.querySelectorAll(".desktop-icon");
    let dragThreshold = 5; // Minimum move distance to count as dragging

    icons.forEach((icon, index) => {
        let offsetX, offsetY, startX, startY, isDragging = false;
        let savedPos = localStorage.getItem(`icon-${index}`);

        if (savedPos) {
            let pos = JSON.parse(savedPos);
            icon.style.left = pos.x + "px";
            icon.style.top = pos.y + "px";
        } else {
            let spacing = 100;
            icon.style.left = "50px";
            icon.style.top = (spacing * index) + 50 + "px";
        }

        icon.addEventListener("mousedown", function (e) {
            e.preventDefault();
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;

            function onMouseMove(e) {
                let moveX = Math.abs(e.clientX - startX);
                let moveY = Math.abs(e.clientY - startY);

                if (moveX > dragThreshold || moveY > dragThreshold) {
                    isDragging = true;
                    icon.style.position = "absolute";
                    icon.style.left = e.clientX - offsetX + "px";
                    icon.style.top = e.clientY - offsetY + "px";
                }
            }

            function onMouseUp(e) {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);

                if (isDragging) {
                    localStorage.setItem(`icon-${index}`, JSON.stringify({
                        x: icon.offsetLeft,
                        y: icon.offsetTop
                    }));

                    // Add a flag to prevent clicks
                    icon.dataset.justDragged = "true";
                    console.log("Drag detected - preventing click");

                    setTimeout(() => {
                        icon.dataset.justDragged = "false";
                        console.log("Click allowed again");
                    }, 200);
                }
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Debugging click event
        icon.addEventListener("click", function (e) {
            console.log("Click event detected");
            if (icon.dataset.justDragged === "true") {
                console.log("Click blocked due to dragging");
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            }

            console.log("Click allowed, navigating to URL");
            window.location.href = icon.dataset.url;
        });
    });

    // Uncomment this to reset icon positions if needed
    // localStorage.clear();
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize gallery frames
    initGalleryFrames();

    // Clock update functionality (unchanged)
    function updateClock() {
        const clockElement = document.getElementById('current-time');
        const now = new Date();

        let hours = now.getHours();
        let minutes = now.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // If 0, set it to 12 (midnight)
        minutes = minutes < 10 ? '0' + minutes : minutes; // Add a leading zero if minutes < 10

        const timeString = hours + ':' + minutes + ' ' + ampm;
        clockElement.textContent = timeString;
    }

    // Update the clock immediately when the page loads, and every minute
    updateClock();
    setInterval(updateClock, 60000);

});

function initGalleryFrames() {
    const frames = document.querySelectorAll('.gallery-frame');
    
    // Set initial positions from localStorage or arrange in grid
    frames.forEach((frame, index) => {
        const frameId = `gallery-frame-${index}`;
        frame.setAttribute('id', frameId);
        
        // Set initial position from localStorage or arrange in grid
        const savedPos = localStorage.getItem(frameId);
        if (savedPos) {
            const pos = JSON.parse(savedPos);
            frame.style.left = pos.x + 'px';
            frame.style.top = pos.y + 'px';
            if (pos.width) frame.style.width = pos.width;
            if (pos.height) frame.style.height = pos.height;
            if (pos.minimized) frame.classList.add('minimized');
            if (pos.maximized) frame.classList.add('maximized');
        } else {
            // Position in a grid - newest at top left
            const row = Math.floor(index / 4);
            const col = index % 4;
            frame.style.left = (20 + col * 50) + 'px';
            frame.style.top = (80 + row * 50) + 'px';
        }
        
        // Make draggable
        makeDraggable(frame);
        
        // Add window controls
        setupWindowControls(frame);
    });
    
    // Raise frame to top on click
    document.addEventListener('mousedown', function(e) {
        const frame = e.target.closest('.gallery-frame');
        if (frame) {
            // Remove active class from all frames
            document.querySelectorAll('.gallery-frame.active').forEach(f => {
                f.classList.remove('active');
            });
            // Add active class to clicked frame
            frame.classList.add('active');
        }
    });
}

function makeDraggable(frame) {
    const header = frame.querySelector('.window-header');
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY, initialWidth, initialHeight, initialMouseX, initialMouseY;
    
    // Dragging functionality
    header.addEventListener('mousedown', function(e) {
        if (e.target.tagName !== 'BUTTON') {
            isDragging = true;
            offsetX = e.clientX - frame.offsetLeft;
            offsetY = e.clientY - frame.offsetTop;
            frame.classList.add('active');
        }
    });
    
    // Resizing functionality
    const resizeHandle = frame.querySelector('.resize-handle');
    if (resizeHandle) {
        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            initialWidth = frame.offsetWidth;
            initialHeight = frame.offsetHeight;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            e.preventDefault();
            e.stopPropagation();
            frame.classList.add('active');
        });
    }
    
    // Mouse move handler
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            frame.style.left = (e.clientX - offsetX) + 'px';
            frame.style.top = (e.clientY - offsetY) + 'px';
        }
        
        if (isResizing) {
            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;
            frame.style.width = (initialWidth + deltaX) + 'px';
            frame.style.height = (initialHeight + deltaY) + 'px';
        }
    });
    
    // Mouse up handler
    document.addEventListener('mouseup', function() {
        if (isDragging || isResizing) {
            saveFramePosition(frame);
        }
        isDragging = false;
        isResizing = false;
    });
}

function setupWindowControls(frame) {
    // Close button
    const closeBtn = frame.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            frame.style.display = 'none';
            // Don't remove from localStorage to allow recovery
        });
    }
    
    // Minimize button
    const minimizeBtn = frame.querySelector('.minimize-btn');
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            frame.classList.toggle('minimized');
            frame.classList.remove('maximized');
            saveFramePosition(frame);
        });
    }
    
    // Maximize button
    const maximizeBtn = frame.querySelector('.maximize-btn');
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', function() {
            frame.classList.toggle('maximized');
            frame.classList.remove('minimized');
            saveFramePosition(frame);
        });
    }
}

function saveFramePosition(frame) {
    const frameId = frame.getAttribute('id');
    const position = {
        x: frame.offsetLeft,
        y: frame.offsetTop,
        width: frame.style.width,
        height: frame.style.height,
        minimized: frame.classList.contains('minimized'),
        maximized: frame.classList.contains('maximized')
    };
    localStorage.setItem(frameId, JSON.stringify(position));
}

// Function to reset gallery positions (can be called from console)
function resetGalleryPositions() {
    const frames = document.querySelectorAll('.gallery-frame');
    frames.forEach((frame, index) => {
        const frameId = frame.getAttribute('id');
        localStorage.removeItem(frameId);
        
        // Reset to grid
        const row = Math.floor(index / 4);
        const col = index % 4;
        frame.style.left = (20 + col * 50) + 'px';
        frame.style.top = (80 + row * 50) + 'px';
        frame.style.width = '';
        frame.style.height = '';
        frame.classList.remove('minimized', 'maximized');
    });
}

//mobile view
document.addEventListener("DOMContentLoaded", function () {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Hide desktop interface
        document.body.classList.add('mobile-view');

        // Generate simple column list from icons
        const iconLinks = document.querySelectorAll('.desktop-icon');
        const mobileContainer = document.createElement('div');
        mobileContainer.classList.add('mobile-links');

        iconLinks.forEach(icon => {
            const link = document.createElement('a');
            link.href = icon.dataset.url;
            link.textContent = icon.dataset.label || icon.title || 'Link';
            mobileContainer.appendChild(link);
        });

        document.body.innerHTML = ''; // Clear existing body
        document.body.appendChild(mobileContainer);
    }
});
