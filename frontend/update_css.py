css_content = r""":root {
  --primary-green: #105928;
  --primary-green-hover: #0c421d;
  --light-green: #a7f3d0;
  --badge-bg: #bbf7d0;
  --bg-color: #f2f6ed;
  --footer-bg: #e5e8e1;
  --text-dark: #1f2937;
  --text-light: #4b5563;
  --card-bg: #ffffff;
  --dark-banner: #114d24;
  --border-color: #e5e7eb;
  --success-green: #059669;
  --warning-orange: #d97706;
  --purple: #8b5cf6;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-dark);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.landing-page {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  gap: 0.5rem;
  text-decoration: none;
  font-family: inherit;
}

.btn-lg {
  padding: 0.875rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn-primary {
  background-color: var(--primary-green);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 89, 40, 0.2);
}

.btn-primary:hover {
  background-color: var(--primary-green-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 89, 40, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background-color: white;
  color: var(--text-dark);
  border: 2px solid var(--primary-green);
}

.btn-secondary:hover {
  background-color: var(--primary-green);
  color: white;
  transform: translateY(-2px);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-dark);
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--success-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.section-subtitle {
  text-align: center;
  color: var(--text-light);
  max-width: 650px;
  margin: 0 auto 3rem auto;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(242, 246, 237, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-green);
  letter-spacing: -0.75px;
  flex-shrink: 0;
}

.navbar-links {
  display: flex;
  gap: 3rem;
  flex: 1;
}

.navbar-links a {
  text-decoration: none;
  color: var(--text-light);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
  position: relative;
}

.navbar-links a:hover {
  color: var(--primary-green);
}

.navbar-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-green);
  transition: width 0.3s ease;
}

.navbar-links a:hover::after {
  width: 100%;
}

/* Hero Section */
.hero {
  padding: 5rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-animated {
  background: linear-gradient(180deg, rgba(16,89,40,0.04) 0%, rgba(167,243,208,0.02) 100%);
  position: relative;
  overflow: hidden;
}

.hero-animated::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(167, 243, 208, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  right: 6%;
  top: 6%;
  width: 48%;
  height: 84%;
  background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(16,89,40,0.06));
  border-radius: 1.5rem;
  pointer-events: none;
  z-index: 5;
  backdrop-filter: blur(6px) saturate(1.05);
}

.hero-content {
  max-width: 550px;
  position: relative;
  z-index: 10;
}

.hero-badge {
  display: inline-block;
  background-color: var(--badge-bg);
  color: var(--primary-green);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(167, 243, 208, 0.5);
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.5rem;
  color: var(--text-dark);
  letter-spacing: -1px;
}

.hero-title span {
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--success-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.7;
  font-weight: 500;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.hero-highlights {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-dark);
  font-weight: 600;
}

.highlight-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--primary-green), var(--success-green));
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.hero-visuals {
  position: relative;
  height: 450px;
}

.hero-main-img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: 1.5rem;
  box-shadow: 0 30px 50px -15px rgba(7, 89, 38, 0.2);
  transition: transform 0.5s cubic-bezier(.2,.9,.3,1), box-shadow 0.3s;
}

.hero-main-img:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 45px 70px -20px rgba(7, 89, 38, 0.25);
}

.hero-card-scan,
.hero-card-weather,
.hero-card-profit {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 20;
  transition: all 0.3s ease;
}

.hero-card-scan {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-card-scan:hover {
  transform: translateX(-50%) translateY(-4px);
  box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.15);
}

.hero-card-weather {
  position: absolute;
  bottom: -30px;
  left: -10px;
  background: linear-gradient(135deg, var(--light-green), rgba(167, 243, 208, 0.7));
  padding: 1.5rem;
  width: 180px;
  min-height: 110px;
}

.hero-card-weather:hover {
  transform: translateY(-4px);
}

.hero-card-profit {
  position: absolute;
  bottom: -30px;
  right: -10px;
  background: linear-gradient(135deg, #dcfce7, rgba(220, 252, 231, 0.7));
  padding: 1.5rem;
  width: 180px;
  min-height: 100px;
}

.hero-card-profit:hover {
  transform: translateY(-4px);
}

/* Features Section */
.features {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(.2,.9,.3,1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(167, 243, 208, 0.1), transparent);
  transition: left 0.5s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-green);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: #f0fdf4;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  font-size: 1.5rem;
  transition: all 0.3s;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  background: white;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-dark);
}

.feature-card p {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s;
  position: relative;
}

.feature-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-green);
  transition: width 0.3s ease;
}

.feature-link:hover::after {
  width: 100%;
}

/* Stats Section */
.stats {
  background-color: var(--dark-banner);
  background-image: linear-gradient(rgba(17, 77, 36, 0.95), rgba(17, 77, 36, 0.95)), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  padding: 4.5rem 2rem;
  margin: 4rem auto;
  max-width: 1160px;
  border-radius: 2.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.2);
}

.stats::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(167, 243, 208, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  text-align: center;
  position: relative;
  z-index: 10;
}

.stat-item {
  color: white;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: block;
  animation: float 3s ease-in-out infinite;
}

.stat-value {
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* How It Works */
.how-it-works {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  position: relative;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.steps-line {
  position: absolute;
  top: 30px;
  left: 5%;
  right: 5%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-green), var(--success-green), var(--primary-green));
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  width: calc(25% - 1.2rem);
  transition: transform 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
}

.step-number {
  width: 50px;
  height: 50px;
  background: white;
  border: 3px solid var(--primary-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--primary-green);
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(16, 89, 40, 0.15);
  transition: all 0.3s ease;
}

.step:hover .step-number {
  background: var(--primary-green);
  color: white;
  transform: scale(1.1);
}

.step-icon {
  color: var(--primary-green);
  margin-bottom: 1.25rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  border-radius: 0.75rem;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.step:hover .step-icon {
  background: var(--light-green);
  transform: scale(1.1);
}

.step h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.step p {
  color: var(--text-light);
  font-size: 0.8rem;
  line-height: 1.5;
}

/* CTA Section */
.cta {
  padding: 3rem 2rem 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cta-card {
  background: linear-gradient(135deg, var(--light-green) 0%, rgba(167, 243, 208, 0.6) 100%);
  border-radius: 2rem;
  padding: 4.5rem 3rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  border: 2px solid rgba(167, 243, 208, 0.5);
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px -15px rgba(16, 89, 40, 0.15);
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.cta-badge {
  display: inline-block;
  background: white;
  color: var(--primary-green);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.cta-card h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-dark);
  letter-spacing: -0.5px;
}

.cta-card p {
  color: var(--primary-green-hover);
  font-size: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 500;
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.cta-feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.875rem;
}

.cta-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: white;
  color: var(--success-green);
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.875rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
}

/* Footer */
.footer {
  background-color: var(--footer-bg);
  padding: 4rem 2rem;
  text-align: center;
  border-top: 2px solid var(--border-color);
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-green);
  margin-bottom: 1.5rem;
  letter-spacing: -0.75px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-dark);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--primary-green);
}

.footer-copyright {
  color: var(--text-light);
  font-size: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.footer-socials {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-socials a {
  color: var(--primary-green);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.3s;
  background: transparent;
  cursor: pointer;
}

.footer-socials a:hover {
  color: var(--primary-green-hover);
  transform: translateY(-3px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 3rem 2rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-visuals {
    height: 350px;
  }

  .step {
    width: calc(50% - 0.75rem);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    padding: 1rem 2rem;
    gap: 1rem;
  }

  .navbar-links {
    gap: 1.5rem;
    order: 3;
    flex-basis: 100%;
    justify-content: center;
  }

  .navbar .btn {
    order: 2;
  }

  .hero {
    padding: 2rem 1rem;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-desc {
    font-size: 0.95rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-buttons .btn {
    width: 100%;
  }

  .hero-highlights {
    display: none;
  }

  .hero-main-img {
    height: 250px;
  }

  .hero-card-scan,
  .hero-card-weather,
  .hero-card-profit {
    position: relative !important;
    bottom: auto !important;
    left: auto !important;
    right: auto !important;
    transform: none !important;
    margin: 1rem 0;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-size: 2rem;
  }

  .features {
    padding: 4rem 1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stats {
    margin: 2rem 1rem;
    padding: 2.5rem 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .step {
    width: 100%;
  }

  .steps-line {
    display: none;
  }

  .how-it-works {
    padding: 4rem 1rem;
  }

  .cta-card {
    padding: 3rem 1.5rem;
  }

  .cta-card h2 {
    font-size: 2rem;
  }

  .cta-features {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-buttons .btn {
    width: 100%;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }

  .footer {
    padding: 3rem 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .navbar-logo {
    font-size: 1.25rem;
  }

  .navbar-links {
    gap: 1rem;
    font-size: 0.75rem;
  }

  .hero {
    padding: 1.5rem 1rem 2rem;
  }

  .hero-title {
    font-size: 1.75rem;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .hero-desc {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .hero-buttons {
    gap: 0.75rem;
  }

  .hero-badge {
    font-size: 0.6rem;
    padding: 0.4rem 0.75rem;
  }

  .hero-visuals {
    height: 250px;
    margin-bottom: 1rem;
  }

  .hero-main-img {
    height: 200px;
    border-radius: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.8rem;
    margin-bottom: 2rem;
  }

  .features {
    padding: 2rem 1rem;
  }

  .feature-card {
    padding: 1.5rem 1rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }

  .feature-card h3 {
    font-size: 1rem;
  }

  .feature-card p {
    font-size: 0.75rem;
  }

  .stats {
    margin: 1.5rem 0.5rem;
    padding: 2rem 0.75rem;
    border-radius: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .how-it-works {
    padding: 2rem 1rem;
  }

  .step {
    margin-bottom: 0.5rem;
  }

  .step h4 {
    font-size: 0.875rem;
  }

  .step p {
    font-size: 0.7rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .cta {
    padding: 2rem 1rem 4rem;
  }

  .cta-card {
    padding: 2rem 1rem;
    border-radius: 1.5rem;
  }

  .cta-card h2 {
    font-size: 1.5rem;
  }

  .cta-card p {
    font-size: 0.875rem;
  }

  .cta-feature-item {
    font-size: 0.75rem;
  }

  .btn {
    padding: 0.65rem 1.25rem;
    font-size: 0.8rem;
  }

  .footer {
    padding: 2rem 1rem;
  }

  .footer-logo {
    font-size: 1.25rem;
  }

  .footer-links {
    gap: 0.75rem;
  }

  .footer-links a {
    font-size: 0.7rem;
  }
}

/* Print Styles */
@media print {
  .navbar,
  .cta,
  .footer-socials {
    display: none;
  }
}
"""

with open(r"d:\agrivita\frontend\src\pages\LandingPage.css", "w", encoding="utf-8") as f:
    f.write(css_content)

print("CSS file updated successfully!")
