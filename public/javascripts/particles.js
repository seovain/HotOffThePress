(function createNebulaBits(){
      const container = document.querySelector('.nebula-particles');
      if (!container) return;

      const CHARS = '01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?/|\\';
      const COUNT = 36;

      function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
      function randChoice(s){ return s.charAt(Math.floor(Math.random()*s.length)); }
      function makeText(len){
        let out = '';
        if (Math.random() < 0.28) {
          for(let i=0;i<len;i++) out += (Math.random()<0.6 ? (Math.random()<0.6 ? '0' : '1') : randChoice('0123456789'));
        } else {
          for(let i=0;i<len;i++) out += randChoice(CHARS);
        }
        return out;
      }

      function spawnBit(i){
        const span = document.createElement('span');
        span.className = 'nebula-bit';
        if (Math.random() < 0.26) span.classList.add('alt');

        const len = rand(1,6);
        span.textContent = makeText(len);

        const left = Math.max(0, Math.min(98, Math.round((i/(COUNT-1))*98 + (Math.random()*5-2.5))));
        span.style.left = left + '%';

        const size = rand(10,26);
        span.style.setProperty('--size', size + 'px');

        const hue = rand(200,270);
        const sat = rand(70,95);
        const light = rand(60,85);
        span.style.setProperty('--col', `hsl(${hue} ${sat}% ${light}%)`);

        const dur = (rand(7,18)) + 's';
        const delay = (-Math.random()*12).toFixed(2) + 's';
        span.style.setProperty('--dur', dur);
        span.style.setProperty('--delay', delay);

        span.style.transform = `translateY(-120%) rotate(${(Math.random()*8-4).toFixed(2)}deg)`;

        container.appendChild(span);

        setTimeout(()=> {
          if (span && span.parentNode) span.parentNode.removeChild(span);
        }, (parseFloat(dur) + 5) * 1000);
      }

      for(let i=0;i<COUNT;i++) spawnBit(i);

      setInterval(()=>{
        const toSpawn = rand(3,7);
        for(let j=0;j<toSpawn;j++){
          spawnBit(rand(0,COUNT-1));
        }
      }, 2500);

    })();