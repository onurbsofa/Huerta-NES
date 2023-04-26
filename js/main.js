document.querySelector(".menu-btn").addEventListener("click", () => {
     document.querySelector(".nav-menu").classList.toggle("show");
  });
  
  ScrollReveal().reveal('.showcase');
  ScrollReveal().reveal('.news-cards', { delay: 500 });
  ScrollReveal().reveal('.cards-banner-one', { delay: 500 });
  ScrollReveal().reveal('.cards-banner-two', { delay: 500 });

/* let primerasImagenes = document.querySelector(".primeras-imagenes")
primerasImagenes.addEventListener("click", () =>{
    var ancho = primerasImagenes.width * 2;
  var alto = primerasImagenes.height * 2;
  primerasImagenes.style.width = ancho + "px";
  primerasImagenes.style.height = alto + "px"; 
}); */