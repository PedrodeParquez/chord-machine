document.addEventListener("DOMContentLoaded", function() {
    const bpmContainer = document.getElementById('bpm');
    let bpmValue = parseInt(bpmContainer.innerText);

    bpmContainer.addEventListener('wheel', function(event) {
        if (event.deltaY < 0) {
            bpmValue = Math.min(bpmValue + 1, 180);
        } else {
            bpmValue = Math.max(bpmValue - 1, 60);
        }

        if (bpmValue > 99) {
            bpmContainer.style.textAlign= 'left';
        } else {
            bpmContainer.style.textAlign= 'center';
        }

        bpmContainer.innerText = bpmValue;
        
        event.preventDefault();
    });
});




