const form = document.getElementById("objednavka");
const rekapitulace = document.getElementById("rekapitulace");

// Funkce pro výpočet celkové ceny
function spocitejCelkovouCenu() {
	let cena = document.getElementById("cena").value;
	let kusy = document.getElementById("kusy").value;
	let celkovaCena = cena * kusy;
	document.getElementById("celkova-cena").value = celkovaCena.toFixed(2);
	return celkovaCena;
}

// Při každé změně množství kusů se aktualizuje celková cena
form.addEventListener("change", () => {
	spocitejCelkovouCenu();
});

// Při odeslání formuláře se zobrazí rekapitulace objednávky a provede se převod na japonské jeny
form.addEventListener("submit", (event) => {
	event.preventDefault(); // zabrání odeslání formuláře na server
	let jmeno = document.getElementById("jmeno").value;
	let email = document.getElementById("email").value;
	let produkt = document.getElementById("produkt").value;
	let cena = spocitejCelkovouCenu();
	let celkovaCenaSDPH = cena * 1.21;
	let kurz = 1; // defaultní kurz CZK -> JPY
	let xhr = new XMLHttpRequest(); 
	xhr.open("GET", "https://api.exchangerate-api.com/v4/latest/CZK", true);
	xhr.onload = function() { 
		if (this.status === 200) {
			let data = JSON.parse(this.responseText);
			kurz = data.rates.JPY;
			let celkovaCenaVJPY = celkovaCenaSDPH * kurz;
			rekapitulace.innerHTML = `
				<h2>Rekapitulace</h2>
				<p><strong>Jméno:</strong> ${jmeno}</p>
				<p><strong>E-mail:</strong> ${email}</p>
				<p><strong>Produkt:</strong> ${produkt}</p>
					<p><strong>Celková cena v CZK (s DPH):</strong> ${celkovaCenaSDPH.toFixed(2)}</p>
				<p><strong>Celková cena v JPY:</strong> ${celkovaCenaVJPY.toFixed(2)}</p>
				<button id="odeslat">Odeslat</button>
			`;
			rekapitulace.style.display = "block";
		} else {
			alert("Chyba při načítání aktuálního kurzu!");
		}
	};
	xhr.send();
});

document.addEventListener('click', function(event) {
	if (event.target.matches('#odeslat')) {
	  window.location.href = "podekovani.html";
	}
  }, false);