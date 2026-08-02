const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const formSubmitBtn = document.getElementById('formSubmitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formSubmitBtn.disabled = true;
  formSubmitBtn.textContent = 'Sendi...';
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  const formData = new FormData(contactForm);
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      formStatus.textContent = 'Takk fyrir! Skilaboðin þín voru send.';
      formStatus.classList.add('form-status--ok');
      contactForm.reset();
    } else {
      throw new Error(result.message || 'Villa kom upp');
    }
  } catch (err) {
    formStatus.textContent = 'Eitthvað fór úrskeiðis. Prófaðu aftur eða sendu okkur línu beint á hello@studiokria.is.';
    formStatus.classList.add('form-status--error');
  } finally {
    formSubmitBtn.disabled = false;
    formSubmitBtn.textContent = 'Senda skilaboð';
  }
});
