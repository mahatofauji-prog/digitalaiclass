const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const heroImages = `
const heroImages = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
];
`;

const importInjectStr = `import { Course } from '../types';`;
code = code.replace(importInjectStr, importInjectStr + '\n' + heroImages);

const targetLocation = `        </div>
      </section>`;

const marqueeCode = `        </div>

        {/* Hero Marquee Animation */}
        <div className="relative mt-12 md:mt-16 w-full flex overflow-hidden group">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          
          {/* Marquee Track */}
          <div className="flex animate-marquee gap-4 px-2 w-[max-content]">
            {[...heroImages, ...heroImages].map((img, i) => (
              <div key={i} className="relative h-40 sm:h-56 md:h-64 w-60 sm:w-80 md:w-96 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 shadow-sm border border-[#E5ECE7]">
                <img src={img} alt="Learning Context" className="w-full h-full object-cover filter hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>`;

code = code.replace(targetLocation, marqueeCode);
fs.writeFileSync('src/pages/Home.tsx', code);
