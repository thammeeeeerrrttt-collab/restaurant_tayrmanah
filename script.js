let cart = [];

// --- حركة الظهور عند التمرير ---
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


// --- إضافة للسلة ---
function addToCart(name, price) {
    cart.push({ name, price });

    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    if (event && event.target) {
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Added! ✅";
        setTimeout(() => {
            btn.innerText = originalText;
        }, 1000);
    }
}


// --- حذف من السلة ---
function removeFromCart(index) {
    cart.splice(index, 1);

    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    openCart();
}


// --- فتح السلة ---
function openCart() {
    const list = document.getElementById('cart-items-list');
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

    document.getElementById('cart-total').innerText = total.toFixed(2);
    document.getElementById('cart-container').style.display = 'block';
}


// --- إغلاق السلة ---
function closeCart() {
    document.getElementById('cart-container').style.display = 'none';
}


// --- 🔥 إرسال واتساب (الجديد) ---
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Please add items first!");
        return;
    }

    let tableNumber = document.getElementById("table-number")?.value || "Not selected";
    let notes = document.getElementById("order-notes")?.value || "None";

    let total = 0;

    let message = `🍽️ New Order - Tayrmanah%0A`;
    message += `Table: ${tableNumber}%0A`;
    message += `Notes: ${notes}%0A%0A`;
    message += `Items:%0A`;

    cart.forEach(item => {
        message += `- ${item.name} : ${item.price.toFixed(2)}€%0A`;
        total += item.price;
    });

    message += `%0A💰 Total: ${total.toFixed(2)} EUR`;

    let phoneNumber = "32470707414"; // ← ضع رقم المطعم هنا

    let url = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, "_blank");
}


// --- PDF الفاتورة ---
async function generatePDF() {
    if (cart.length === 0) {
        alert("Please add items to your order first!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: [80, 160] });

    // شعار (إذا موجود في HTML)
    const logo = document.getElementById("restaurant-logo");
    if (logo) {
        doc.addImage(logo, 'PNG', 25, 5, 30, 20);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TAYRMANAH", 40, 30, { align: "center" });

    let tableNumber = document.getElementById("table-number")?.value || "-";

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Table: ${tableNumber}`, 5, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 5, 46);

    let y = 55;
    let total = 0;

    cart.forEach(item => {
        doc.text(item.name, 5, y);
        doc.text(`${item.price.toFixed(2)}€`, 70, y, { align: "right" });
        total += item.price;
        y += 7;
    });

    doc.line(5, y, 75, y);

    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ${total.toFixed(2)} EUR`, 70, y + 10, { align: "right" });

    doc.save("Tayrmanah_Order.pdf");
}function sendBookingEmail() {

    let name = document.querySelector("input[name='name']").value;
    let email = document.querySelector("input[name='email']").value;
    let phone = document.querySelector("input[name='phone']").value;
    let guests = document.querySelector("input[name='guests']").value;
    let date = document.querySelector("input[name='date']").value;
    let time = document.querySelector("input[name='time']").value;
    let seating = document.querySelector("select[name='seating_type']").value;
    let message = document.querySelector("textarea[name='message']").value;

    let subject = "📅 Table Reservation - Tayrmanah";

    let body = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Guests: ${guests}
Date: ${date}
Time: ${time}
Seating: ${seating}
Notes: ${message}
`;

    let mailtoLink =
        `mailto:Tayrmanah@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}