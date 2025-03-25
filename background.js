chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "breakReminder") {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Break Reminder',
            message: 'Time to take a break!',
            priority: 2
        });
    }
});

