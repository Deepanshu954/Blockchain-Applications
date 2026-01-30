"use client";

import { FileText, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Paper Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-semibold">Research Paper</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Blockchain Applications: Technical Foundations & Enterprise
              Transformation
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Abstract", id: "abstract" },
                { label: "Case Studies", id: "case-studies" },
                { label: "Future Directions", id: "future" },
                { label: "References", id: "references" },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Citation */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Citation</h4>
            <div className="bg-white/5 border border-white/10 p-4 font-mono text-xs text-white/70 leading-relaxed">
              IEEE / Springer Format
              <br />
              Publication-ready academic paper
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>
            © {new Date().getFullYear()} Academic Research Paper. All rights
            reserved.
          </p>
          <p className="text-xs">Deepanshu Chauhan</p>
        </div>
      </div>
    </footer>
  );
}
