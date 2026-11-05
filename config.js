/* Cole abaixo os links OFICIAIS dos apps quando estiverem publicados.
   Deixe vazio enquanto não houver um link confirmado.
   Exemplo de formato: https://play.google.com/store/apps/details?id=SEU.PACOTE */
const linksPlayStore = {
  sistema: '',
  controle: ''
};
for (const [app, link] of Object.entries(linksPlayStore)) {
  if (!link) continue;
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || url.hostname !== 'play.google.com') continue;
    const button = document.querySelector(`[data-store="${app}"]`);
    if (button) { button.href = url.href; button.textContent = 'Ver na Play Store ↗'; }
  } catch { /* Preserva o contato se o link não for válido. */ }
}
document.getElementById('year').textContent = new Date().getFullYear();
