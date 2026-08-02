const fs = require('fs');
const contentToAppend = `
/* Subscribe & Win Form Styles */
.subscribe-win-container {
    margin: 3rem auto 0 auto;
    width: 100%;
    max-width: 650px;
    padding: 2.5rem;
    border-color: var(--color-border-glass);
    animation: fadeUp 1s ease-out 1.4s forwards;
    opacity: 0;
    text-align: left;
}

.subscribe-win-container h3 {
    font-family: var(--font-heading);
    color: var(--color-copper);
    font-size: 1.6rem;
    text-align: center;
    margin-bottom: 0.5rem;
    letter-spacing: 2px;
}

.subscribe-win-container p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 1.5rem;
}

.subscribe-win-container .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.subscribe-win-container .form-group {
    margin-bottom: 1.25rem;
}

.subscribe-win-container label {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    margin-bottom: 6px;
    display: block;
    font-family: var(--font-body);
}

.subscribe-win-container input,
.subscribe-win-container select,
.subscribe-win-container textarea {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(196, 139, 113, 0.2);
    border-radius: 8px;
    color: #fff;
    font-family: var(--font-body);
    font-size: 0.95rem;
    transition: var(--transition-smooth);
}

.subscribe-win-container select option {
    background: #121212;
    color: #fff;
}

.subscribe-win-container input:focus,
.subscribe-win-container select:focus,
.subscribe-win-container textarea:focus {
    outline: none;
    border-color: var(--color-copper);
    background: rgba(255, 255, 255, 0.06);
}

.subscribe-win-container textarea {
    resize: vertical;
}

/* Mobile Optimizations for Subscribe form */
@media (max-width: 576px) {
    .subscribe-win-container {
        padding: 1.5rem;
        margin-top: 2rem;
    }
    .subscribe-win-container h3 {
        font-size: 1.35rem;
    }
    .subscribe-win-container p {
        font-size: 0.8rem;
        margin-bottom: 1.25rem;
    }
    .subscribe-win-container .form-row {
        grid-template-columns: 1fr;
        gap: 0;
    }
}

/* Sales Banner Cards Hover Effect */
.sales-banner-card:hover {
    transform: translateY(-5px);
    border-color: var(--color-copper) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.sales-banner-card:hover img {
    transform: scale(1.03);
}
`;
fs.appendFileSync('src/app/globals.css', contentToAppend);
