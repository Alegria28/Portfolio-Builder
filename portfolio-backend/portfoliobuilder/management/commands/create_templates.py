from django.core.management.base import BaseCommand
from portfoliobuilder.models import Template

class Command(BaseCommand):
    help = 'Create sample portfolio templates'

    def handle(self, *args, **options):
        # Minimal Template
        minimal_html = """
        <div class="portfolio-container">
            <header class="hero">
                <h1>{{hero_title}}</h1>
                <p>{{hero_subtitle}}</p>
            </header>
            <section class="about">
                <h2>About</h2>
                <p>{{about_content}}</p>
            </section>
            <section class="projects">
                <h2>Projects</h2>
                <div class="projects-grid">{{projects}}</div>
            </section>
            <section class="contact">
                <h2>Contact</h2>
                <div class="contact-info">{{contact}}</div>
            </section>
        </div>
        """
        
        minimal_css = """
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .portfolio-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .hero { text-align: center; padding: 4rem 0; background: #f8f9fa; margin-bottom: 3rem; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #2c3e50; }
        .hero p { font-size: 1.2rem; color: #7f8c8d; }
        section { margin-bottom: 3rem; }
        h2 { font-size: 2rem; margin-bottom: 1.5rem; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #ecf0f1; padding: 2rem; border-radius: 8px; }
        @media (max-width: 768px) { .hero h1 { font-size: 2rem; } .portfolio-container { padding: 1rem; } }
        """

        # Professional Template
        professional_html = """
        <div class="portfolio-wrapper">
            <nav class="navbar">
                <div class="nav-brand">{{hero_title}}</div>
                <ul class="nav-links">
                    <li><a href="#about">About</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
            <header class="hero-section">
                <div class="hero-content">
                    <h1>{{hero_title}}</h1>
                    <h2>{{hero_subtitle}}</h2>
                    <div class="hero-cta">
                        <button class="btn-primary">View My Work</button>
                        <button class="btn-secondary">Download CV</button>
                    </div>
                </div>
            </header>
            <section id="about" class="section">
                <div class="container">
                    <h2>About Me</h2>
                    <p>{{about_content}}</p>
                </div>
            </section>
            <section id="experience" class="section bg-light">
                <div class="container">
                    <h2>Experience</h2>
                    <div class="experience-timeline">{{experience}}</div>
                </div>
            </section>
            <section id="projects" class="section">
                <div class="container">
                    <h2>Featured Projects</h2>
                    <div class="projects-showcase">{{projects}}</div>
                </div>
            </section>
            <footer id="contact" class="footer">
                <div class="container">
                    <h2>Let's Connect</h2>
                    <div class="contact-grid">{{contact}}</div>
                </div>
            </footer>
        </div>
        """
        
        professional_css = """
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .navbar { position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 1rem 0; z-index: 1000; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
        .navbar .container { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .nav-brand { font-size: 1.5rem; font-weight: bold; color: #2c3e50; }
        .nav-links { display: flex; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #2c3e50; font-weight: 500; transition: color 0.3s; }
        .nav-links a:hover { color: #3498db; }
        .hero-section { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
        .hero-content h1 { font-size: 4rem; margin-bottom: 1rem; }
        .hero-content h2 { font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }
        .hero-cta { display: flex; gap: 1rem; justify-content: center; }
        .btn-primary, .btn-secondary { padding: 1rem 2rem; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-primary { background: white; color: #667eea; }
        .btn-secondary { background: transparent; color: white; border: 2px solid white; }
        .section { padding: 5rem 0; }
        .bg-light { background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        h2 { font-size: 2.5rem; margin-bottom: 2rem; text-align: center; color: #2c3e50; }
        .projects-showcase { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
        .footer { background: #2c3e50; color: white; padding: 3rem 0; }
        @media (max-width: 768px) { .hero-content h1 { font-size: 2.5rem; } .hero-cta { flex-direction: column; align-items: center; } }
        """

        # Creative Template
        creative_html = """
        <div class="creative-portfolio">
            <div class="sidebar">
                <div class="profile">
                    <div class="profile-image"></div>
                    <h1>{{hero_title}}</h1>
                    <p>{{hero_subtitle}}</p>
                </div>
                <nav class="side-nav">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#portfolio">Portfolio</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
            <div class="main-content">
                <section id="home" class="section active">
                    <div class="hero-creative">
                        <h2>Welcome to My Creative Space</h2>
                        <p>{{about_content}}</p>
                    </div>
                </section>
                <section id="portfolio" class="section">
                    <h2>My Work</h2>
                    <div class="creative-grid">{{projects}}</div>
                </section>
                <section id="contact" class="section">
                    <h2>Get In Touch</h2>
                    <div class="contact-creative">{{contact}}</div>
                </section>
            </div>
        </div>
        """
        
        creative_css = """
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', sans-serif; background: #1a1a1a; color: white; }
        .creative-portfolio { display: flex; min-height: 100vh; }
        .sidebar { width: 300px; background: linear-gradient(45deg, #ff6b6b, #feca57); padding: 2rem; position: fixed; height: 100vh; }
        .profile { text-align: center; margin-bottom: 3rem; }
        .profile-image { width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); margin: 0 auto 1rem; }
        .profile h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
        .side-nav a { display: block; padding: 1rem 0; color: white; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2); transition: all 0.3s; }
        .side-nav a:hover { padding-left: 1rem; }
        .main-content { margin-left: 300px; padding: 2rem; flex: 1; }
        .section { min-height: 100vh; padding: 2rem 0; }
        .hero-creative { text-align: center; padding: 4rem 0; }
        .hero-creative h2 { font-size: 3rem; margin-bottom: 2rem; background: linear-gradient(45deg, #ff6b6b, #feca57); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .creative-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .creative-grid .project { background: #2a2a2a; padding: 2rem; border-radius: 15px; transform: rotate(-2deg); transition: all 0.3s; }
        .creative-grid .project:nth-child(even) { transform: rotate(2deg); }
        .creative-grid .project:hover { transform: rotate(0deg) scale(1.05); }
        @media (max-width: 768px) { .sidebar { width: 100%; position: relative; height: auto; } .main-content { margin-left: 0; } }
        """

        templates_data = [
            {
                'name': 'Minimal Clean',
                'description': 'A clean and minimal portfolio template perfect for professionals who prefer simplicity.',
                'template_type': 'minimal',
                'html_content': minimal_html,
                'css_content': minimal_css,
                'js_content': '',
                'is_premium': False
            },
            {
                'name': 'Professional Business',
                'description': 'A professional template with modern design, perfect for business professionals and consultants.',
                'template_type': 'professional',
                'html_content': professional_html,
                'css_content': professional_css,
                'js_content': '',
                'is_premium': False
            },
            {
                'name': 'Creative Showcase',
                'description': 'A bold and creative template perfect for designers, artists, and creative professionals.',
                'template_type': 'creative',
                'html_content': creative_html,
                'css_content': creative_css,
                'js_content': '',
                'is_premium': True
            }
        ]

        for template_data in templates_data:
            template, created = Template.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created template "{template.name}"')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Template "{template.name}" already exists')
                )