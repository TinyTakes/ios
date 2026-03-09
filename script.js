// ============================================================
// TinyTakes Beta Feedback - Form Handler
// ============================================================
// IMPORTANT: Replace this URL with your deployed Google Apps Script URL.
// See SETUP.md for instructions.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5-48D2ppE8o0-RYwUAfQIPg1RyPEvOv1X9mGUn4mCMQpHQc7uhuAuwhTlqHjPIl0llg/exec';
// ============================================================

const form = document.getElementById('feedback-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// Form submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    showError('Google Apps Script URL not configured');
    return;
  }

  setLoading(true);

  try {
    const bugReport = form.bugReport.value.trim();
    const featureRequest = form.featureRequest.value.trim();
    const generalFeedback = form.generalFeedback.value.trim();

    if (!bugReport && !featureRequest && !generalFeedback) {
      showError('Please fill out at least one feedback field.');
      setLoading(false);
      return;
    }

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      device: form.device.value.trim(),
      appVersion: form.appVersion.value.trim(),
      bugReport: bugReport,
      featureRequest: featureRequest,
      generalFeedback: generalFeedback,
      screenshot: '',
    };

    // Handle screenshot upload
    const screenshotFile = document.getElementById('screenshot').files[0];
    if (screenshotFile) {
      if (screenshotFile.size > 5 * 1024 * 1024) {
        showError('Screenshot must be under 5MB.');
        setLoading(false);
        return;
      }
      formData.screenshot = await fileToBase64(screenshotFile);
      formData.screenshotName = screenshotFile.name;
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // With no-cors mode, we can't read the response, so we assume success
    // if no error was thrown
    showSuccess();
  } catch (err) {
    showError('Failed to submit feedback. Please check your connection and try again.');
  } finally {
    setLoading(false);
  }
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.style.display = loading ? 'none' : '';
  btnLoading.style.display = loading ? '' : 'none';
}

function showSuccess() {
  form.style.display = 'none';
  errorMessage.style.display = 'none';
  successMessage.style.display = '';
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = '';
}

function hideError() {
  errorMessage.style.display = 'none';
}

function resetForm() {
  form.reset();
  form.style.display = '';
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}
