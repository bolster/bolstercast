// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var wshost = 'ws://10.1.10.252:8181/';

var ws = null;

if('WebSocket' in window){
  connect();
}

function connect() {
  if(ws) {
    ws.close();
    ws = null;
  }

  ws = new WebSocket(wshost);

  ws.onopen = function () {
    console.log("connected");
  };

  ws.onmessage = function (evt) {
    if(localStorage['type'] !== "client")
      return;

    var data = JSON.parse(evt.data);
    var url = data.url;
    // Get the currently selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Toggle the pinned status
      var current = tabs[0];
      chrome.tabs.update(current.id, {url: url});
    });
  };

  ws.onclose = function () {
    console.log("Not connected");
    setTimeout(function() {
      connect();
    }, 1500);
  };
}

chrome.browserAction.onClicked.addListener(function(tab) {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // Toggle the pinned status
    var current = tabs[0];
    ws.send(JSON.stringify({
      'action': 'update',
      'data': {
        'url': current.url
      }
    }));
  });
});
