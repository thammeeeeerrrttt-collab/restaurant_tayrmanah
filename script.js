// 1. كود استخراج رقم الطاولة من الرابط تلقائياً عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const tableId = urlParams.get('table'); 
    
    const tableInput = document.getElementById('table-number');
    if (tableInput) {
        if (tableId) {
            tableInput.value = tableId;
            tableInput.readOnly = true;
            
            const infoText = document.createElement('p');
            infoText.innerHTML = `📍 <b>Tafel: ${tableId}</b> (Bevestigd)`;
            infoText.style.color = "#28a745"; 
            infoText.style.fontSize = "14px";
            tableInput.parentNode.insertBefore(infoText, tableInput);
        } else {
            tableInput.value = ""; 
            tableInput.placeholder = "Scan QR Code first!";
        }
    }
});

let cart = [];

// 2. حركة الظهور عند التمرير
document.addEventListener("DOMContentLoaded", function () {
    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            let windowHeight = window.innerHeight;
            let elementTop = reveals[i].getBoundingClientRect().top;
            let elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active-reveal");
            }
        }
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});

// 3. إضافة للسلة
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartCount();

    if (event && event.target) {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Added! ✅";
        setTimeout(() => { btn.innerText = originalText; }, 1000);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) { cartCount.innerText = cart.length; }
}

// 4. حذف من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    openCart();
}

// 5. فتح السلة وتحديث البيانات بداخلها
function openCart() {
    const list = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('cart-total');
    let total = 0;
    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div style="display:flex; flex-direction:column;">
                        <span>${item.name}</span>
                        <span style="font-weight:bold; color:#d35400;">${item.price.toFixed(2)} €</span>
                    </div>
                    <button onclick="removeFromCart(${index})"
                        style="background:#ff4d4d; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">
                        Remove
                    </button>
                </div>`;
            total += item.price;
        });
    }

    if (totalDisplay) { totalDisplay.innerText = total.toFixed(2); }
    document.getElementById('cart-container').style.display = 'block';
}

// 6. إغلاق السلة
function closeCart() {
    document.getElementById('cart-container').style.display = 'none';
}

// 7. 🔥 إرسال واتساب + تحميل فاتورة PDF تلقائياً
async function sendToWhatsApp() {
    let tableNumber = document.getElementById("table-number")?.value;

    // شرط الحماية: يجب وجود رقم طاولة
    if (!tableNumber || tableNumber.trim() === "") {
        alert("⚠️ يرجى أن تكون في المطعم لتأكيد طلبك عبر مسح الكود الموجود على الطاولة.\nOm uw bestelling te plaatsen, moet u de QR-code scannen.");
        return;
    }

    if (cart.length === 0) {
        alert("Please add items first!");
        return;
    }

    // أولاً: توليد وتحميل ملف PDF باسم الطاولة
    await generatePDF();

    // ثانياً: تجهيز وإرسال رسالة الواتساب
    let notes = document.getElementById("order-notes")?.value || "None";
    let total = 0;

    let message = `🍽️ *New Order - Tayrmanah*%0A`;
    message += `📍 *Table:* ${tableNumber}%0A`;
    message += `📝 *Notes:* ${notes}%0A%0A`;
    message += `*Items:*%0A`;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} : ${item.price.toFixed(2)}€%0A`;
        total += item.price;
    });

    message += `%0A💰 *Total: ${total.toFixed(2)} EUR*`;
    message += `%0A%0A📄 _De factuur is gedownload op mijn apparaat._`;

    let phoneNumber = "32470707414"; 
    let url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
}

// 8. PDF الفاتورة (معدلة لتعمل مع الإرسال)
async function generatePDF() {
    if (cart.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: [80, 160] });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TAYRMANAH", 40, 20, { align: "center" });

    let tableNumber = document.getElementById("table-number")?.value || "Unknown";
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Table: ${tableNumber}`, 5, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 5, 41);

    let y = 50;
    let total = 0;
    cart.forEach(item => {
        doc.text(item.name, 5, y);
        doc.text(`${item.price.toFixed(2)}€`, 75, y, { align: "right" });
        total += item.price;
        y += 7;
    });

    doc.line(5, y, 75, y);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ${total.toFixed(2)} EUR`, 75, y + 10, { align: "right" });

    // حفظ الملف برقم الطاولة
    doc.save(`Order_Table_${tableNumber}.pdf`);
}

// 9. حجز الطاولات
function sendReservationToWhatsApp() {
    const name = document.getElementById('res-name').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const guests = document.getElementById('res-guests').value;
    const seating = document.getElementById('res-seating').value;
    const message = document.getElementById('res-message').value;

    if (!name || !date || !time) {
        alert("Vul alstublieft uw naam, datum en tijd in.");
        return;
    }

    let whatsappMessage = `📅 *NIEUWE RESERVERING - TAYRMANAH*%0A`;
    whatsappMessage += `--------------------------%0A`;
    whatsappMessage += `*Naam:* ${name}%0A`;
    whatsappMessage += `*Datum:* ${date}%0A`;
    whatsappMessage += `*Tijd:* ${time}%0A`;
    whatsappMessage += `*Aantal personen:* ${guests}%0A`;
    whatsappMessage += `*Type:* ${seating}%0A`;
    
    if (message) {
        whatsappMessage += `*Opmerking:* ${message}%0A`;
    }
    whatsappMessage += `--------------------------%0A`;
    whatsappMessage += `Graag een bevestiging, bedankt!`;

    const phoneNumber = "32470707414"; 
    const url = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(url, "_blank");
}