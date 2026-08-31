const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const oldPhone = `<Phone className="w-2.5 h-2.5 text-[#C5A059]" /> 0911704132 / 0919454971
              </span>`;

const newPhone = `<Phone className="w-2.5 h-2.5 text-[#C5A059]" /> 0911704132 / 0919454971
              </span>
              <span className="text-[10px] text-white/60 tracking-wider font-mono flex items-center gap-1 mt-1">
                <Mail className="w-2.5 h-2.5 text-[#C5A059]" /> dam09031@gmail.com
              </span>`;

content = content.replace(oldPhone, newPhone);

// Ensure Mail is imported from lucide-react
if (!content.includes('Mail')) {
  content = content.replace('Phone } from \'lucide-react\';', 'Phone, Mail } from \'lucide-react\';');
  content = content.replace('Sparkles, ShieldCheck, Truck, RefreshCw, Phone } from \'lucide-react\'', 'Sparkles, ShieldCheck, Truck, RefreshCw, Phone, Mail } from \'lucide-react\'');
}

fs.writeFileSync('src/components/Footer.tsx', content);
