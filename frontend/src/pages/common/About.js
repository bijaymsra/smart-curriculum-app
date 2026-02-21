import React from "react";

export default function About() {
  return (
    <div className="bg-slate-950 text-white min-h-screen scroll-smooth selection:bg-blue-600/30">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Attenza
          </a>

          <a
            href="/"
            className="text-sm md:text-base border border-slate-700 px-5 py-2 rounded-xl hover:bg-slate-800 transition-all duration-300"
          >
            ← Back to Home
          </a>
        </div>
      </nav>



      {/* ================= ABOUT CONTENT ================= */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Transforming Educational Management
          </h2>

          <p className="mt-6 text-slate-400 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base md:text-lg">
            The Smart Curriculum & Personalized Management System is a unified
            enterprise-grade platform combining cutting-edge automation with
            educational excellence. We streamline attendance tracking while
            enhancing productivity through intelligent scheduling and adaptive
            recommendations.
          </p>

          <p className="mt-6 text-slate-400 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base md:text-lg">
            Leveraging secure QR-based verification and predictive analytics,
            our system eliminates manual errors, reduces administrative burden,
            and transforms idle academic time into measurable growth — aligned
            with the NEP 2020 vision of technology-enabled personalized learning.
          </p>

          {/* Vision & Mission */}
          <div className="mt-16 grid gap-8 md:grid-cols-2">

            <div className="p-8 md:p-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 hover:border-blue-500/60 transition-all duration-500 shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-xl md:text-2xl font-semibold">Our Vision</h3>
              <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
                To build a future-ready educational ecosystem where intelligent
                automation seamlessly enhances academic outcomes,
                institutional efficiency, and student success.
              </p>
            </div>

            <div className="p-8 md:p-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 hover:border-purple-500/60 transition-all duration-500 shadow-lg hover:shadow-purple-500/10">
              <h3 className="text-xl md:text-2xl font-semibold">Our Mission</h3>
              <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
                Empower institutions with scalable, secure, and intelligent
                tools that maximize engagement, ensure attendance accuracy,
                and drive personalized learning experiences.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 md:py-28 px-6 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            How It Works
          </h2>

          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Secure, scalable and intelligent attendance workflow
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            {/* Card 1 */}
            <div className="group p-8 bg-slate-800/70 rounded-3xl border border-slate-700 hover:border-blue-500 transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl">📱</div>
              <h3 className="mt-6 font-semibold text-lg md:text-xl">
                QR Code Generation
              </h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Dynamically generated, time-bound QR codes prevent fraud
                and ensure secure real-time session validation.
              </p>
              <ul className="mt-4 text-sm text-slate-400 space-y-2 text-left">
                <li>• Time-limited codes</li>
                <li>• Session verification</li>
                <li>• Fraud prevention</li>
                <li>• Instant validation</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-slate-800/70 rounded-3xl border border-slate-700 hover:border-purple-500 transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl">🧠</div>
              <h3 className="mt-6 font-semibold text-lg md:text-xl">
                Personalized Planner
              </h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                AI-driven recommendations transform idle hours into
                productive academic and career-focused activities.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-slate-800/70 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl">📊</div>
              <h3 className="mt-6 font-semibold text-lg md:text-xl">
                Analytics Dashboard
              </h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Real-time institutional insights into attendance trends,
                engagement metrics, and academic performance patterns.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Why Choose Attenza?
          </h2>

          <p className="mt-4 text-slate-400">
            Built for scalability, security and institutional excellence
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

            {[
              "Time Efficient",
              "Accurate Tracking",
              "Real-time Analytics",
              "Secure & Private",
              "NEP 2020 Aligned",
              "Easy Integration",
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all duration-500 hover:scale-105"
              >
                <h4 className="font-semibold text-sm md:text-base">
                  {item}
                </h4>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 md:py-28 px-6 text-center bg-gradient-to-br from-blue-900/30 via-slate-900 to-purple-900/20 border-y border-slate-800">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Ready to Transform Your Institution?
        </h2>

        <p className="mt-6 text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Join forward-thinking institutions leveraging AI-driven
          attendance and academic intelligence.
        </p>

        <a
          href="signup"
          className="mt-8 inline-block px-8 py-4 text-sm md:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105"
        >
          Request a Demo
        </a>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Attenza — Smart Curriculum & Personalized System Management.
        <div className="mt-2">
          Developed by Bijay Kumar Mishra
        </div>
      </footer>

    </div>
  );
}