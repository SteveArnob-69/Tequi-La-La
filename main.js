// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNavLink();
});

// ─── Hamburger menu ───
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
});

document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('menu-open');
    });
});

// ─── Active nav link on scroll ───
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = 'home';

    sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top <= 120) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${current}`);
    });
}

// ─── Scroll reveal ───
const revealEls = document.querySelectorAll('.section-heading, .yellow-list, .img-frame, .team-card, .stat-box, .contact-card, .toc-list, .hero-text, .hero-logo-wrap, .pics-grid, .conclusion-text');

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ─── Staggered children reveal ───
document.querySelectorAll('.team-grid, .contact-grid, .conclusion-stats').forEach(grid => {
    grid.querySelectorAll(':scope > *').forEach((child, i) => {
        child.classList.add('reveal');
        const childObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 100);
                    childObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        childObs.observe(child);
    });
});
// ─── Reservation Form ───
const resForm = document.getElementById('reservation-form');
const eventSelect = document.getElementById('res-event');
const otherEventGroup = document.getElementById('other-event-group');
const otherEventInput = document.getElementById('res-event-other');
const formStatus = document.getElementById('form-status');

const RESERVATION_WEBHOOK = "https://discord.com/api/webhooks/1503689264578297918/oiNXn5EpnmwCUyZzaqO3kUd-4LzToqiDSTDNQ4Y55MdwLGMM0k-drLrZyNs14NFYGzwF";

eventSelect.addEventListener('change', (e) => {
    if (e.target.value === 'Other') {
        otherEventGroup.style.display = 'block';
        otherEventInput.required = true;
    } else {
        otherEventGroup.style.display = 'none';
        otherEventInput.required = false;
    }
});

resForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = resForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';

    const name = document.getElementById('res-name').value;
    const cid = document.getElementById('res-cid').value;
    const number = document.getElementById('res-number').value;
    const guests = document.getElementById('res-guests').value;
    const date = document.getElementById('res-date').value;
    let event = eventSelect.value;
    
    if (event === 'Other') {
        event = otherEventInput.value;
    }

    const payload = {
        username: "Tequi-La-La | Reservations",
        embeds: [{
            title: "📅 New Reservation Request",
            color: 0xe8ff00,
            fields: [
                { name: "👤 Name", value: name, inline: true },
                { name: "🆔 CID", value: cid, inline: true },
                { name: "📞 Phone", value: number, inline: true },
                { name: "🎉 Event", value: event, inline: true },
                { name: "👥 Guests", value: guests, inline: true },
                { name: "📅 Date", value: date, inline: true }
            ],
            footer: { text: "Tequi-La-La Showcase" },
            timestamp: new Date()
        }]
    };

    try {
        const response = await fetch(RESERVATION_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showStatus('Success! Your reservation request has been sent.', 'success');
            resForm.reset();
            otherEventGroup.style.display = 'none';
        } else {
            throw new Error('Failed to send');
        }
    } catch (err) {
        showStatus('Error sending reservation. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Confirm Booking';
    }
});

function showStatus(msg, type) {
    formStatus.innerText = msg;
    formStatus.className = `form-status ${type}`;
    setTimeout(() => {
        formStatus.className = 'form-status';
    }, 5000);
}
