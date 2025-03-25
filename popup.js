
let currentBreakTime = null;

document.addEventListener('DOMContentLoaded', function() {
    const breakTimeInput = document.getElementById('breakTime');
    const setBreakButton = document.getElementById('setBreak');
    const resetButton = document.getElementById('reset');
    const currentBreakTimeDiv = document.getElementById('currentBreakTime');
    const loading = document.getElementById('loading');
    const title = document.getElementById('title');

    function showStartWindow() {
        title.style.display = 'block';
        breakTimeInput.style.display='block';
        setBreakButton.style.display='block';
        currentBreakTimeDiv.innerText= '';
        resetButton.style.display = 'none';
        loading.style.display = 'none';
    }

    function showChangeWindow(){
        currentBreakTimeDiv.innerText = `Current Break Time: ${currentBreakTime} minutes`;
        breakTimeInput.style.display = 'none'; 
        setBreakButton.style.display = 'none'; 
        resetButton.style.display = 'block';
        title.style.display = 'none';
        loading.style.display = 'none';
    }

    chrome.storage.sync.get(['breakTime'], function(result) {
        if (result.breakTime) {
            currentBreakTime = result.breakTime;
            showChangeWindow();
        } else {
            showStartWindow();
        }
    });


    setBreakButton.addEventListener('click', function () {
        currentBreakTime = breakTimeInput.value;
        
        const breakTime = parseInt(breakTimeInput.value);
        if (breakTime >= 0.5 && breakTime <= 60) {
            chrome.storage.sync.set({ breakTime: breakTime }, function() {
                alert('Break time set to ' + breakTime + ' minutes');
                chrome.alarms.create("breakReminder", { periodInMinutes: breakTime });
            });
            showChangeWindow();
        } else {
            alert('Please enter a value between 0.5 and 60.');
        }
    });


    resetButton.addEventListener('click', function() {
        currentBreakTime = null;
        showStartWindow();

        chrome.alarms.clear("breakReminder", function(wasCleared) {
            if (wasCleared) {
                console.log("Alarm was cleared successfully.");
            } else {
                console.log("No alarm found with that name.");
            }
        });


        chrome.storage.sync.remove(['breakTime'], function() {
            breakTimeInput.value = '';
            alert('Break time reset.');
        });

   
    });
});

