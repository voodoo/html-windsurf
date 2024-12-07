document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation buttons and sections
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main > section');

    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionToShow = button.dataset.section;
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });

            // Show the selected section
            const activeSection = document.getElementById(sectionToShow);
            activeSection.classList.remove('hidden');
            activeSection.classList.add('active');

            // Update active button state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Add hover effects to recipe cards
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});
