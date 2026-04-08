const inventory = {
    oberteil: [
        'images/oberteile/shirt_001.png', 'images/oberteile/shirt_002.png',
        'images/oberteile/shirt_003.png', 'images/oberteile/shirt_004.png',
        'images/oberteile/shirt_005.png', 'images/oberteile/shirt_006.png',
        'images/oberteile/shirt_007.png', 'images/oberteile/shirt_008.png',
        'images/oberteile/shirt_009.png', 'images/oberteile/shirt_010.png',
        'images/oberteile/shirt_011.png', 'images/oberteile/shirt_012.png',
        'images/oberteile/shirt_013.png', 'images/oberteile/shirt_014.png',
        'images/oberteile/shirt_015.png'
    ],
    tasche: [
        'images/taschen/bag_001.png', 'images/taschen/bag_002.png',
        'images/taschen/bag_003.png', 'images/taschen/bag_004.png'
    ],
    hose: [
        'images/hosen/pants_001.png', 'images/hosen/pants_002.png',
        'images/hosen/pants_003.png', 'images/hosen/pants_004.png',
        'images/hosen/pants_005.png', 'images/hosen/pants_006.png',
        'images/hosen/pants_007.png', 'images/hosen/pants_008.png',
        'images/hosen/pants_009.png', 'images/hosen/pants_010.png'
    ],
    schuhe: ['images/schuhe/shoes_001.png']
};

let userFaceData = null;

document.addEventListener('DOMContentLoaded', () => {
    Object.keys(inventory).forEach(cat => renderThumbnails(cat));
    setupHover();
    setupRunway();
});

function renderThumbnails(category) {
    const grid = document.getElementById(`grid-${category}`);
    if(!grid) return;
    
    inventory[category].forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'thumbnail';
        
        // Touch/Klick Event
        img.onclick = () => {
            const slot = document.getElementById(`slot-${category}`);
            slot.innerHTML = `<img src="${src}">`;
            setupHover(); // Re-aktiviert Hover/Zoom für neue Bilder
        };
        
        img.onerror = () => img.remove();
        grid.appendChild(img);
    });
}

function setupHover() {
    const overlay = document.getElementById('fullscreen-overlay');
    const overlayImg = document.getElementById('fullscreen-img');
    const slots = document.querySelectorAll('.outfit-slot');

    slots.forEach(slot => {
        // Desktop Hover
        slot.onmouseenter = () => {
            const img = slot.querySelector('img');
            if(img && window.innerWidth > 800) {
                overlayImg.src = img.src;
                overlay.classList.add('active');
            }
        };
        slot.onmouseleave = () => overlay.classList.remove('active');
        
        // Mobile "Deep Press" Simulation (Optional: Klick auf Slot zeigt Großansicht)
        slot.onclick = () => {
            const img = slot.querySelector('img');
            if(img && window.innerWidth <= 800) {
                overlayImg.src = img.src;
                overlay.classList.add('active');
                setTimeout(() => overlay.classList.remove('active'), 2000);
            }
        };
    });
    
    overlay.onclick = () => overlay.classList.remove('active');
}

async function setupRunway() {
    const runwayBtn = document.getElementById('runwayBtn');
    const webcamOverlay = document.getElementById('webcam-overlay');
    const video = document.getElementById('webcam-video');
    const captureBtn = document.getElementById('captureBtn');
    const char = document.getElementById('character');

    runwayBtn.onclick = async () => {
        if (!userFaceData) {
            webcamOverlay.classList.add('active');
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "user" } 
                });
                video.srcObject = stream;
            } catch (err) {
                alert("Kamera konnte nicht gestartet werden. Bitte Berechtigung prüfen.");
                webcamOverlay.classList.remove('active');
            }
        } else {
            startShow();
        }
    };

    captureBtn.onclick = () => {
        const canvas = document.getElementById('webcam-canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        userFaceData = canvas.toDataURL('image/png');
        
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        webcamOverlay.classList.remove('active');
        startShow();
    };

    function startShow() {
        const headSlot = document.getElementById('char-head');
        headSlot.innerHTML = `<img src="${userFaceData}">`;
        
        ['oberteil', 'hose', 'schuhe'].forEach(cat => {
            const currentImg = document.querySelector(`#slot-${cat} img`);
            const charPart = document.getElementById(`char-${cat}`);
            if (currentImg) {
                charPart.style.backgroundImage = `url(${currentImg.src})`;
            }
        });

        char.style.display = 'flex';
        char.classList.add('active');
        
        setTimeout(() => {
            char.classList.remove('active');
            char.style.display = 'none';
        }, 7500);
    }
}