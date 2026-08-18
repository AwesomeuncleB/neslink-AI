"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SCHOLARSHIPS } from "@/lib/rubrics";
import { useAuth } from "@/lib/useAuth";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const scholarshipsList = Object.values(SCHOLARSHIPS);

  useEffect(() => {
    // If user arrived from an email confirmation link with a hash token, route to dashboard cleanly
    if (typeof window !== "undefined" && window.location.hash && window.location.hash.includes("access_token")) {
      window.history.replaceState(null, "", window.location.pathname);
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Get Grounded Feedback on Your Scholarship Essays
          </h1>
          <p className="hero-subtitle">
            Targeted coaching and rubric-grounded analysis across global scholarship applications. Prepare for greatness before you submit.
          </p>
          <div className="hero-cta-group">
            {!user ? (
              <>
                <Link href="/signup" className="btn-primary-hero">
                  Create Account to Review →
                </Link>
                <Link href="/login" className="btn-secondary-hero">
                  Sign In
                </Link>
              </>
            ) : (
              <Link href="/app" className="btn-primary-hero">
                Go to Reviewer Desk →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* STATS HIGHLIGHT STRIP */}
      <section className="stats-strip">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-num">Global</div>
            <div className="stat-label">Multi-Scholarship Rubric Alignment</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">1-10</div>
            <div className="stat-label">Calibrated Scoring & Assessment Grid</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">Line Notes</div>
            <div className="stat-label">Direct Sentence & Evidence Feedback</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">100%</div>
            <div className="stat-label">Private & Authentic Coaching</div>
          </div>
        </div>
      </section>

      {/* SCHOLARSHIPS CATALOG SECTION */}
      <section className="section alt-bg" id="scholarships">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Supported Scholarships</h2>
            <p className="section-subtitle">
              Tailored essay coaching calibrated specifically against each scholarship committee&apos;s published criteria.
            </p>
          </div>

          <div className="scholarships-grid">
            {scholarshipsList.map((s) => (
              <div
                key={s.key}
                className={`scholarship-card ${
                  s.status === "coming_soon" ? "scholarship-coming-soon" : ""
                }`}
              >
                <div className="scholarship-card-header">
                  <h3>{s.name}</h3>
                  {s.status === "coming_soon" ? (
                    <span className="badge-coming-soon">Coming Soon</span>
                  ) : (
                    <span className="badge-available">Available Now</span>
                  )}
                </div>
                <p className="scholarship-description">{s.description}</p>
                {s.tagline && (
                  <div className="scholarship-essay-types">
                    <strong>Focus:</strong> {s.tagline}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUBRIC CATEGORIES OVERVIEW */}
      <section className="section" id="rubrics">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Essay Assessment Rubrics</h2>
            <p className="section-subtitle">
              What selection committees evaluate across core scholarship essay dimensions.
            </p>
          </div>
          <div className="rubric-grid">
            <div className="rubric-card">
              <div className="rubric-card-header">Leadership and Influence</div>
              <p className="rubric-prompt">
                &ldquo;Describe your leadership and influencing skills. What have you done to make a positive impact on others?&rdquo;
              </p>
              <div className="rubric-key">
                <strong>Key Focus:</strong> Specific personal action driving measurable outcomes, not generic team credit.
              </div>
            </div>

            <div className="rubric-card">
              <div className="rubric-card-header">Networking & Relationship-Building</div>
              <p className="rubric-prompt">
                &ldquo;Give an example of how you have built strong professional relationships and how this led to positive outcomes...&rdquo;
              </p>
              <div className="rubric-key">
                <strong>Key Focus:</strong> Strategic relationship building resulting in tangible outcomes & realistic network plans.
              </div>
            </div>

            <div className="rubric-card">
              <div className="rubric-card-header">Course Choice & Academic Alignment</div>
              <p className="rubric-prompt">
                &ldquo;How will your chosen course help you address challenges linked to key priority areas?&rdquo;
              </p>
              <div className="rubric-key">
                <strong>Key Focus:</strong> Concrete module research connected to home country challenges and strategic priority themes.
              </div>
            </div>

            <div className="rubric-card">
              <div className="rubric-card-header">Career Plan & Development Impact</div>
              <p className="rubric-prompt">
                &ldquo;How will your career plan support your ambitions to drive positive change?&rdquo;
              </p>
              <div className="rubric-key">
                <strong>Key Focus:</strong> Clear short-term, mid-term, and long-term milestones with intent to return home and drive change.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section alt-bg" id="features">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Designed for Serious Applicants</h2>
            <p className="section-subtitle">
              Read your essays through the lens of an experienced review committee.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Rubric-Grounded Scoring</h3>
              <p>
                Evaluated against specific scoring criteria for leadership impact, strategic networking, module alignment, and career milestones.
              </p>
            </div>
            <div className="feature-card">
              <h3>Specific Line Notes</h3>
              <p>
                Pinpoints exact phrases across your draft with specific notes highlighting narrative strengths and areas needing evidence.
              </p>
            </div>
            <div className="feature-card">
              <h3>Priority Action Items</h3>
              <p>
                Delivers a clear, prioritized checklist of what to fix first so you can edit efficiently before deadlines.
              </p>
            </div>
            <div className="feature-card">
              <h3>Authentic Coaching</h3>
              <p>
                Offers strict diagnosis and guidance while preserving your authentic writing and voice — never generates text for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section" id="faq">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary className="faq-question">Does Neslink AI rewrite or generate text for my application?</summary>
              <p className="faq-answer">
                No. Neslink AI provides evaluation, line notes, and diagnostic coaching only — pointing out weaknesses and suggesting what a stronger version would demonstrate without writing replacement sentences for you, in strict compliance with scholarship AI guidelines.
              </p>
            </details>
            <details className="faq-item">
              <summary className="faq-question">Why do I need to create an account?</summary>
              <p className="faq-answer">
                Creating an account ensures your essay drafts and reading panel scorecards are securely saved, allowing you to track your essay improvements over time.
              </p>
            </details>
            <details className="faq-item">
              <summary className="faq-question">Which scholarships are currently supported?</summary>
              <p className="faq-answer">
                Chevening Scholarship is available today with all 4 essay rubrics. Mastercard Foundation, DAAD, Commonwealth, and Fulbright rubrics are coming soon.
              </p>
            </details>
            <details className="faq-item">
              <summary className="faq-question">Is my essay draft kept confidential?</summary>
              <p className="faq-answer">
                Yes. Your draft is processed for your private review session and is never shared, published, or used for model training.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner-section">
        <div className="cta-banner-container">
          <h2>Ready to elevate your scholarship essays?</h2>
          <p>Create your free account and get your drafts evaluated against reading panel criteria in seconds.</p>
          {!user ? (
            <Link href="/signup" className="btn-primary-hero">
              Create Account to Start →
            </Link>
          ) : (
            <Link href="/app" className="btn-primary-hero">
              Go to Reviewer Desk →
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              Neslink <span className="ai-mark">AI</span>
            </div>
            <p>Global Scholarship Essay Assessment & Coaching Platform</p>
          </div>
          <div className="footer-links">
            <Link href="/#scholarships">Scholarships</Link>
            <Link href="/#rubrics">Rubrics</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} Neslink AI. All rights reserved.
        </div>
      </footer>
    </>
  );
}
