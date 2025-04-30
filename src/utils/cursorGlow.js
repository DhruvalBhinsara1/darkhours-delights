function handleGlowEffect() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Get mouse x position relative to card
            const y = e.clientY - rect.top;  // Get mouse y position relative to card

            // Convert to percentage
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            // Update CSS variables
            card.style.setProperty('--mouse-x', `${xPercent}%`);
            card.style.setProperty('--mouse-y', `${yPercent}%`);
        });

        // Reset the glow position when mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Initialize the glow effect
document.addEventListener('DOMContentLoaded', handleGlowEffect);

// Re-initialize when new cards are added (if using dynamic content)
export const initGlowEffect = handleGlowEffect; 