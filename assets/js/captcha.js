// captcha.js

// Variable to track if hCaptcha is already loaded
let isHcaptchaLoaded = false;

// Function to add hCaptcha to the specific element
function loadHcaptcha() {
    if (isHcaptchaLoaded) return; // Prevent loading hCaptcha more than once

    // Create the hCaptcha div
    const hcaptchaDiv = document.createElement('div');
    hcaptchaDiv.className = 'h-captcha';
    hcaptchaDiv.setAttribute('data-sitekey', '1b5c7e6e-8452-4c6c-918e-e7ea08dee9f8'); // Replace with your actual site key

    // Append the hCaptcha div to the target element
    const captchaContainer = document.getElementById('captchaContainer');
    captchaContainer.appendChild(hcaptchaDiv);

    // Render hCaptcha
    hcaptcha.render(hcaptchaDiv, {
        callback: onCaptchaSuccess // Set callback for hCaptcha success
    });

    // Set the flag to indicate hCaptcha has been loaded
    isHcaptchaLoaded = true;
}

// Call the function to load hCaptcha when the document is fully loaded


// Function to handle successful captcha completion
function onCaptchaSuccess() {
    // Hide the overlay and captcha container to allow interaction
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('captchaContainer').style.display = 'none';
    document.getElementById('contentCaptchaWarning').style.display = 'none';
    document.body.style.overflow = 'auto'; // or 'scroll' if you want to force scrollbars
    alert("Captcha completed! You can now access the content.");
}