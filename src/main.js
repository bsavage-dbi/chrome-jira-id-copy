const stringReverse = (s) => {
  return s.split('').reverse().join('');
};

const getTaskIDFromURL = (url) => {
  const match = stringReverse(url).match(/\d+-[A-Z0-9]+(?!-?[a-zA-Z]{1,10})/g);

  return (url.indexOf('.atlassian.net') > -1 && match !== null)
    ? stringReverse(match[0])
    : null;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (getTaskIDFromURL(tab.url) !== null) {
    chrome.pageAction.show(tabId);
  }
});

chrome.pageAction.onClicked.addListener((tab) => {
  const input = document.createElement('textArea');
  const body = document.body;
  const taskID = getTaskIDFromURL(tab.url);

  input.textContent = taskID;
  body.appendChild(input);
  input.select();
  document.execCommand('copy');
  body.removeChild(input);

  chrome.notifications.create({
    'type': 'basic',
    'title': 'Hell yeah',
    'iconUrl': 'task_icon.png',
    'message': `${taskID} copied.`
  }, (notificationID) => {
    setTimeout(() => {
      chrome.notifications.clear(notificationID)
    }, 1500);
  });
});