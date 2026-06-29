document.addEventListener("DOMContentLoaded", () => {

    // Mobile Menu
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if(navToggle){
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));

            if(target){
                target.scrollIntoView({
                    behavior:"smooth"
                });
            }
        });
    });

});