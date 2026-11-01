const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');
const contactSubmit = document.getElementById('contactSubmit');

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    contactSubmit.disabled = true;
    contactStatus.textContent = 'Sending your message...';
    contactStatus.classList.remove('is-error');

    try {
        const formData = new FormData(contactForm);
        const result = await window.restaurantApi.createContact(
            Object.fromEntries(formData.entries())
        );
        contactStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent = error.message;
        contactStatus.classList.add('is-error');
    } finally {
        contactSubmit.disabled = false;
    }
});
