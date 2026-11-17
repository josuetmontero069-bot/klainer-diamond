const $ = (id) => document.getElementById(id);
let selectedService = "";
let orders = JSON.parse(localStorage.getItem("kd_orders") || "[]");
let balance = Number(localStorage.getItem("kd_balance") || 0);
const prices = JSON.parse(localStorage.getItem("kd_prices") || '{"Recargas digitales":10,"Tarjetas y códigos":15,"Otros servicios":5}');
$("balance").textContent = balance;

function saveOrders(){ localStorage.setItem("kd_orders", JSON.stringify(orders)); renderOrders(); }
function renderOrders(){
  const html = orders.length ? orders.map(o => `<div class="order-row"><div><strong>${escapeHtml(o.service)}</strong><br><span class="muted small">${escapeHtml(o.details)}</span></div><span class="status">${escapeHtml(o.status)}</span></div>`).join("") : '<p class="muted">Todavía no tienes pedidos en este navegador.</p>';
  $("ordersList").innerHTML = html;
  $("adminOrders").innerHTML = html;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
renderOrders();

$("menuButton").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
document.querySelectorAll(".order-service").forEach(btn=>btn.addEventListener("click",()=>{
  selectedService=btn.dataset.service;
  $("dialogTitle").textContent="Solicitar: "+selectedService;
  $("orderDetails").value="";
  $("orderDialog").showModal();
}));
$("cancelOrder").addEventListener("click",()=>$("orderDialog").close());
$("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  orders.unshift({id:Date.now(),service:selectedService,details:$("orderDetails").value.trim(),status:"Pendiente"});
  saveOrders(); $("orderDialog").close();
});
$("addCredit").addEventListener("click",()=>alert("Para añadir créditos KAL, contacta con soporte: 51561036. Esta versión no procesa pagos."));
$("loginButton").addEventListener("click",()=>alert("El acceso con Google todavía no está conectado. Para activarlo se necesita configurar Google/Firebase y un servidor seguro. No introduzcas tu contraseña en esta demo."));
$("adminToggle").addEventListener("click",()=>$("adminPanel").classList.toggle("hidden"));
$("savePrices").addEventListener("click",()=>{
  const p={"Recargas digitales":Number($("priceRecargas").value),"Tarjetas y códigos":Number($("priceTarjetas").value),"Otros servicios":Number($("priceOtros").value)};
  localStorage.setItem("kd_prices",JSON.stringify(p));
  alert("Precios de demostración guardados en este navegador.");
});
$("chatForm").addEventListener("submit",e=>{
  e.preventDefault();
  const q=$("chatInput").value.trim(); if(!q)return;
  addChat(q,"user-message"); $("chatInput").value="";
  const t=q.toLowerCase();
  let a="Puedo orientarte sobre servicios, pedidos, saldo KAL y soporte. ¿Qué necesitas saber?";
  if(t.includes("saldo")||t.includes("kal")) a="KAL es la moneda interna prevista para Klainer Diamond. En esta demo el saldo no tiene valor real.";
  else if(t.includes("pedido")||t.includes("solicitud")) a="Entra en Servicios digitales, pulsa Solicitar y describe tu solicitud. Verás el pedido en Mis pedidos.";
  else if(t.includes("soporte")||t.includes("contacto")) a="Puedes contactar con soporte en el número 51561036.";
  else if(t.includes("google")||t.includes("cuenta")||t.includes("entrar")) a="El inicio de sesión con Google está pendiente de configuración. Esta demo no solicita contraseñas.";
  else if(t.includes("precio")) a="Los precios que aparecen en el panel son solo ejemplos y todavía no son precios reales.";
  setTimeout(()=>addChat(a,"bot-message"),250);
});
function addChat(text,cls){const p=document.createElement("p");p.className=cls;p.textContent=text;$("chatMessages").appendChild(p);$("chatMessages").scrollTop=$("chatMessages").scrollHeight;}
