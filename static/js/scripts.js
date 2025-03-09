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

document.addEventListener("DOMContentLoaded", function() {
    const icons = document.querySelectorAll(".desktop-icon");

    icons.forEach(icon => {
        let isDragging = false;
        let offsetX, offsetY;

        // Drag functionality for icons
        icon.addEventListener("mousedown", function(e) {
            // Prevent click-through during dragging
            e.preventDefault();

            isDragging = true;
            offsetX = e.clientX - icon.getBoundingClientRect().left;
            offsetY = e.clientY - icon.getBoundingClientRect().top;
            icon.style.position = "absolute";  // Ensure icon is positioned absolutely
            icon.style.zIndex = "10";  // Bring the icon to the front while dragging
        });

        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                icon.style.left = e.clientX - offsetX + "px";
                icon.style.top = e.clientY - offsetY + "px";
            }
        });

        document.addEventListener("mouseup", function() {
            if (isDragging) {
                isDragging = false;
                icon.style.zIndex = "1";  // Reset z-index when not dragging
                // Here we can prevent the link from being triggered after drag
                e.preventDefault();
            }
        });
    });



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
